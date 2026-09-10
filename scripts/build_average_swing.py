"""Build an anonymized 'average lab swing' bat trajectory from theia_hitting_db.

Averages bat_origin (knob), bat_distal (tip), sweet_spot and blast_hand (hand,
6" off the knob) 3D trajectories, time-aligned to ball contact, translated so
contact sits at the origin. Output is a small JSON of averaged numbers only (no
athlete data); it has no per-athlete values and is safe to publish.

Run (Driveline VPN required; BIOMECH_DB_* creds in ~/.claude/.env):
    python scripts/build_average_swing.py [n_swings]

Writes src/data/averageSwing.json, which the Blast primer imports. Cohort:
clean right-handed swings (needs_review=0, bad_datas_point=0, bat_datas_exist=1,
bad_datas_bat=0, no tag/drill_tag), contact_test.status='ok', 2025-06-01 onward,
50-90 mph bat speed, robust-filtered to 3 MAD.
"""
from __future__ import annotations
import os, re, subprocess, gzip, json, base64, math, random, sys
from pathlib import Path
import pymysql

def get_secret(name: str):
    val = os.environ.get(name)
    if val:
        return val
    env_file = Path.home() / ".claude" / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8", errors="ignore").splitlines():
            m = re.match(rf'^\s*{re.escape(name)}\s*=\s*(.+)$', line)
            if m:
                return m.group(1).strip()
    if os.name == "nt":
        try:
            out = subprocess.check_output(["powershell", "-NoProfile", "-Command",
                 f'[Environment]::GetEnvironmentVariable("{name}", "User")'],
                text=True, stderr=subprocess.DEVNULL).strip()
            if out:
                return out
        except Exception:
            pass
    return None

N_SWINGS = int(sys.argv[1]) if len(sys.argv) > 1 else 1200
HAND = "R"
DATE_FROM = "2025-06-01"
T0_MS, T1_MS = -460.0, 160.0
NGRID = 130
random.seed(7)

conn = pymysql.connect(host=get_secret("BIOMECH_DB_HOST"), port=int(get_secret("BIOMECH_DB_PORT") or 3306),
                       user=get_secret("BIOMECH_DB_USER"), password=get_secret("BIOMECH_DB_PASS"),
                       database="theia_hitting_db", connect_timeout=15, read_timeout=300)
cur = conn.cursor()

cur.execute("""
  SELECT t.session_trial, t.fs_point, ct.ball_contact_frame, s.date
  FROM trials t
  JOIN contact_test ct ON ct.session_trial=t.session_trial
  JOIN sessions s ON s.session=t.session
  JOIN poi p ON p.session_trial=t.session_trial
  WHERE t.needs_review=0 AND t.bad_datas_point=0 AND t.bat_datas_exist=1 AND t.bad_datas_bat=0
    AND COALESCE(t.tag,'')='' AND COALESCE(t.drill_tag,'')=''
    AND t.handedness=%s AND s.date >= %s
    AND ct.status='ok' AND ct.ball_contact_frame IS NOT NULL
    AND p.bat_speed_max BETWEEN 50 AND 90
""", (HAND, DATE_FROM))
all_rows = list(cur.fetchall())
print("eligible swings:", len(all_rows))
random.shuffle(all_rows)
rows = all_rows[:N_SWINGS]
print("sampled:", len(rows))

def dec(b64):
    raw = base64.b64decode(b64)
    data = gzip.decompress(raw) if raw[:2] == b"\x1f\x8b" else raw
    return json.loads(data)

def sanitize(obj):
    out = {}
    for a in ("0", "1", "2"):
        arr = obj[a]
        idx = [i for i, v in enumerate(arr) if v is not None]
        if not idx:
            return None
        vals = list(arr)
        for i in range(0, idx[0]):
            vals[i] = arr[idx[0]]
        for i in range(idx[-1] + 1, len(arr)):
            vals[i] = arr[idx[-1]]
        for k in range(len(idx) - 1):
            i0, i1 = idx[k], idx[k + 1]
            if i1 > i0 + 1:
                v0, v1 = arr[i0], arr[i1]
                for i in range(i0 + 1, i1):
                    f = (i - i0) / (i1 - i0)
                    vals[i] = v0 + (v1 - v0) * f
        out[a] = vals
    return out

def interp(obj, fidx):
    i = int(math.floor(fidx))
    i = max(0, min(len(obj["0"]) - 1, i))
    j = min(len(obj["0"]) - 1, i + 1)
    f = fidx - math.floor(fidx)
    return [obj[a][i] + (obj[a][j] - obj[a][i]) * f for a in ("0", "1", "2")]

t_ms = [T0_MS + (T1_MS - T0_MS) * k / (NGRID - 1) for k in range(NGRID)]
ci = min(range(NGRID), key=lambda k: abs(t_ms[k]))

def fetch(chunk):
    ph = ",".join(["%s"] * len(chunk))
    cur.execute(f"""
      SELECT l.session_trial,
             TO_BASE64(l.bat_origin), TO_BASE64(l.bat_distal), TO_BASE64(l.sweet_spot),
             TO_BASE64(l.blast_hand), TO_BASE64(l.l_heel), TO_BASE64(l.r_heel)
      FROM landmarks_raw l WHERE l.session_trial IN ({ph})
    """, chunk)
    return {r[0]: r[1:] for r in cur.fetchall()}

trials = []
BATCH = 150
for b in range(0, len(rows), BATCH):
    chunk = [r[0] for r in rows[b:b+BATCH]]
    blobs = fetch(chunk)
    for st, fs, cf, date in rows[b:b+BATCH]:
        if st not in blobs or not blobs[st][0]:
            continue
        try:
            origin = sanitize(dec(blobs[st][0])); distal = sanitize(dec(blobs[st][1]))
            sweet = sanitize(dec(blobs[st][2])); hand = sanitize(dec(blobs[st][3]))
            lh = sanitize(dec(blobs[st][4])); rh = sanitize(dec(blobs[st][5]))
        except Exception:
            continue
        if not all([origin, distal, sweet, hand, lh, rh]):
            continue
        def grid(obj):
            return [interp(obj, cf + t / 1000.0 * fs) for t in t_ms]
        o, d, s, h = grid(origin), grid(distal), grid(sweet), grid(hand)
        cabs = list(s[ci])
        heelz = 0.5 * (interp(lh, cf)[2] + interp(rh, cf)[2])
        def rel(pts):
            return [[p[0]-cabs[0], p[1]-cabs[1], p[2]-cabs[2]] for p in pts]
        o, d, s, h = rel(o), rel(d), rel(s), rel(h)
        pks = [math.dist(h[k+1], h[k]) / ((t_ms[k+1]-t_ms[k])/1000.0) for k in range(NGRID-1)]
        pk_t = t_ms[max(range(len(pks)), key=lambda k: pks[k])]
        trials.append({"o": o, "d": d, "s": s, "h": h, "cabz": cabs[2], "heelz": heelz, "fs": fs, "st": st, "pk_t": pk_t})
    print(f"  {min(b+BATCH, len(rows))}/{len(rows)}", end="\r")
print()
print("decoded swings:", len(trials))

def mean_traj(key, data):
    return [[sum(tr[key][k][a] for tr in data) / len(data) for a in range(3)] for k in range(NGRID)]

m_o, m_d, m_s, m_h = mean_traj("o", trials), mean_traj("d", trials), mean_traj("s", trials), mean_traj("h", trials)

def rms(tr):
    return math.sqrt(sum((tr["d"][k][a]-m_d[k][a])**2 for k in range(NGRID) for a in range(3)) / (NGRID*3))

dists = sorted(rms(tr) for tr in trials)
med = dists[len(dists)//2]
mad = sorted(abs(x-med) for x in dists)[len(dists)//2] or 1e-6
cut = med + 3.0*1.4826*mad
trials = [tr for tr in trials if rms(tr) <= cut]
print(f"robust filter kept {len(trials)} (cut {cut:.3f} m)")
m_o, m_d, m_s, m_h = mean_traj("o", trials), mean_traj("d", trials), mean_traj("s", trials), mean_traj("h", trials)
pk_times = sorted(tr["pk_t"] for tr in trials)
peak_hand_speed_ms = pk_times[len(pk_times)//2]
print(f"median peak hand speed time: {peak_hand_speed_ms:.0f} ms from contact")

def smooth(traj, w=7):
    half = w // 2
    out = []
    for k in range(len(traj)):
        lo, hi = max(0, k-half), min(len(traj)-1, k+half)
        win = traj[lo:hi+1]
        out.append([sum(p[a] for p in win)/len(win) for a in range(3)])
    return out

m_o, m_d, m_s, m_h = smooth(m_o), smooth(m_d), smooth(m_s), smooth(m_h)

def speed(tr, key, k):
    dt = (t_ms[k+1]-t_ms[k])/1000.0
    return math.dist(tr[key][k+1], tr[key][k])/dt

kick = max(0, ci-4)
avg_speed = sum(speed(tr, "d", kick) for tr in trials) / len(trials)
ground_z = sum(tr["heelz"] for tr in trials)/len(trials)
contact_abs_z = sum(tr["cabz"] for tr in trials)/len(trials)
print(f"avg barrel tip speed near contact: {avg_speed*2.23694:.1f} mph")
print(f"ground_z={ground_z:.3f}  contact_abs_z={contact_abs_z:.3f}  contact height={contact_abs_z-ground_z:.3f} m")

# data-driven phase times (ms relative to contact) from the events table
EVCOLS = ["start_time", "load_time", "fp_time", "slot_time", "bat_path_back_time",
          "bat_path_middle_time", "bat_path_front_time", "peak_bat_speed_time", "finish_time"]
evs = []
sts = [tr["st"] for tr in trials]
for b in range(0, len(sts), 400):
    chunk = sts[b:b+400]
    ph = ",".join(["%s"] * len(chunk))
    cur.execute(f"SELECT bat_contact_time, {','.join(EVCOLS)} FROM events WHERE session_trial IN ({ph})", chunk)
    for r in cur.fetchall():
        if r[0] is None:
            continue
        evs.append([(float(v) - float(r[0])) * 1000.0 if v is not None else None for v in r[1:]])
events_ms = {}
for j, c in enumerate(EVCOLS):
    vals = [e[j] for e in evs if e[j] is not None]
    if vals:
        vals.sort()
        events_ms[c] = round(vals[len(vals)//2], 0)
print("events_ms:", events_ms)

# swing-plane PCA on the downswing barrel points
pts = [m_d[k] for k in range(NGRID) if -260 <= t_ms[k] <= 40]
cx = [sum(p[a] for p in pts)/len(pts) for a in range(3)]
cov = [[sum((p[i]-cx[i])*(p[j]-cx[j]) for p in pts)/len(pts) for j in range(3)] for i in range(3)]
def mv(M, v): return [sum(M[i][j]*v[j] for j in range(3)) for i in range(3)]
def nrm(v):
    n = math.sqrt(sum(x*x for x in v)) or 1.0
    return [x/n for x in v]
u = nrm([1.0, 0.0, 0.0])
for _ in range(80):
    u = nrm(mv(cov, u))
def dot(a, b): return sum(a[i]*b[i] for i in range(3))
au = dot(u, mv(cov, u))
cov2 = [[cov[i][j]-u[i]*u[j]*au for j in range(3)] for i in range(3)]
w2 = nrm([0.0, 0.0, 1.0])
for _ in range(80):
    w2 = nrm(mv(cov2, w2))
def cross(a, b): return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
n = nrm(cross(u, w2))
r = max(math.dist(p, cx) for p in pts)

rnd = lambda x: round(x, 4)
out = {
    "meta": {
        "source": "theia_hitting_db.landmarks_raw + contact_test",
        "handedness": HAND, "n_swings": len(trials), "date_from": DATE_FROM,
        "window_ms": [T0_MS, T1_MS], "units": "meters",
        "frame": {"x": "toward pitcher", "y": "lateral", "z": "up"},
        "note": "Contact at origin. Averaged, anonymized. The lab average, not a target.",
    },
    "t_ms": [round(t, 1) for t in t_ms],
    "origin": [[rnd(c) for c in p] for p in m_o],
    "distal": [[rnd(c) for c in p] for p in m_d],
    "sweet": [[rnd(c) for c in p] for p in m_s],
    "hand": [[rnd(c) for c in p] for p in m_h],
    "peak_hand_speed_ms": round(peak_hand_speed_ms, 0),
    "contact_index": ci,
    "bat_speed_mph": round(avg_speed*2.23694, 1),
    "contact_height_m": round(contact_abs_z-ground_z, 3),
    "events_ms": events_ms,
    "plane": {"center": [rnd(c) for c in cx], "normal": [rnd(c) for c in n], "u": [rnd(c) for c in u], "radius": round(r, 4)},
}
dest = Path(__file__).resolve().parents[1] / "src" / "data" / "averageSwing.json"
dest.write_text(json.dumps(out), encoding="utf-8")
print("wrote", dest, dest.stat().st_size, "bytes")
conn.close()
