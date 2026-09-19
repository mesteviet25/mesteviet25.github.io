import { ballPosition } from "./flight.js?v=20260916-20";
import { seriesColors, sequencingSegments } from "./palette.js?v=20260916-20";
/**
 * The 3D stage: the averaged bat and the averaged body, on one clock.
 *
 * Everything is driven by a single frame index, so the bat and the body stay
 * registered at contact (both are translated so the bat's sweet spot at contact
 * sits at the origin). The app owns the clock; this class only draws the frame
 * it is handed and exposes `project` so callouts can anchor to 3D points.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const GOLD = 0xffa300;
const BODY = 0xffffff;
const ATHENS = 0xf4f4f5;
const CHROME = 0x9ca3af;
const MID = 0x6b7280;
const TRACK = 0x262626;
const RED = 0xef4444;

const V = (p) => new THREE.Vector3(p[0], p[1], p[2]);
const centroid = (arr) =>
  [0, 1, 2].map((a) => arr.reduce((s, p) => s + p[a], 0) / arr.length);

export class SwingScene {
  constructor(canvas, overlay) {
    this.canvas = canvas;
    this.overlay = overlay;
    this.data = null;
    this.layers = {
      body: true,
      path: true,
      plane: false,
      zone: false,
      ground: true,
    };

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
    this.camera.up.set(0, 0, 1);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = false;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.15));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(-1.4, -1.8, 2.2);
    this.scene.add(dir);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    this._bones = [];
    this._tmpA = new THREE.Vector3();
    this._tmpB = new THREE.Vector3();
    this._zAxis = new THREE.Vector3(0, 0, 1);
    this._yAxis = new THREE.Vector3(0, 1, 0);
  }

  load(data) {
    this.data = data;
    const { scene } = this;
    const T = data.t_ms;
    const D = data.distal;
    const O = data.origin;
    const S = data.sweet;
    this.GROUND = -data.contact_height_m;

    // Frame on the hitter and the through-zone action, not the whole load arc:
    // the full window is 2.15 s, and fitting all of it leaves the body tiny.
    const inSwing = (k) => data.t_ms[k] >= -420 && data.t_ms[k] <= 170;
    const bodyPts = Object.values(data.body).flat();
    this.target = centroid(bodyPts);
    this.allPts = [
      ...bodyPts,
      ...D.filter((_, k) => inSwing(k)),
      ...S.filter((_, k) => inSwing(k)),
    ];
    let rad = 0;
    for (const p of this.allPts)
      rad = Math.max(rad, V(p).distanceTo(V(this.target)));
    this.RAD = rad;
    const camDist = (rad / Math.tan((this.camera.fov * Math.PI) / 360)) * 1.05;
    this.defaultDistance = camDist;
    this.controls.target.copy(V(this.target));
    this.controls.minDistance = rad * 0.8;
    this.controls.maxDistance = rad * 7;
    this.camera.position.copy(
      V(this.target).add(
        new THREE.Vector3(-0.85, -1.0, 0.62)
          .normalize()
          .multiplyScalar(camDist),
      ),
    );
    this.controls.update();

    // ground grid
    this.grid = new THREE.GridHelper(3, 15, TRACK, 0x1a1a1a);
    this.grid.rotation.x = Math.PI / 2;
    this.grid.position.set(this.target[0], this.target[1], this.GROUND);
    this.grid.material.transparent = true;
    this.grid.material.opacity = 0.55;
    scene.add(this.grid);

    // strike zone (illustrative)
    this.zone = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.26, 0.44, 0.6)),
      new THREE.LineBasicMaterial({
        color: 0xd1d5db,
        transparent: true,
        opacity: 0.85,
      }),
    );
    this.zone.position.set(-0.06, 0, 0.0);
    scene.add(this.zone);

    // swing plane, bounded to the downswing
    this.plane = (() => {
      const n = V(data.plane.normal),
        u = V(data.plane.u);
      const v = new THREE.Vector3().crossVectors(n, u).normalize();
      const c = V(data.plane.center);
      let aMin = Infinity,
        aMax = -Infinity,
        bMin = Infinity,
        bMax = -Infinity;
      for (const p of D) {
        const pp = V(p).sub(c);
        const a = pp.dot(u),
          b = pp.dot(v);
        aMin = Math.min(aMin, a);
        aMax = Math.max(aMax, a);
        bMin = Math.min(bMin, b);
        bMax = Math.max(bMax, b);
      }
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(aMax - aMin, bMax - bMin),
        new THREE.MeshBasicMaterial({
          color: GOLD,
          transparent: true,
          opacity: 0.07,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      mesh.quaternion.setFromRotationMatrix(
        new THREE.Matrix4().makeBasis(u, v, n),
      );
      mesh.position
        .copy(c)
        .add(u.clone().multiplyScalar((aMin + aMax) / 2))
        .add(v.clone().multiplyScalar((bMin + bMax) / 2));
      scene.add(mesh);
      return mesh;
    })();

    // Swept surface: each strip is the entire bat at consecutive captured frames.
    // Colors use the matching time samples, not spline arc length.
    const positions = [],
      frameIndices = [];
    for (let k = 0; k < S.length - 1; k++) {
      for (const [track, index] of [
        [O, k],
        [D, k],
        [D, k + 1],
        [O, k],
        [D, k + 1],
        [O, k + 1],
      ]) {
        positions.push(...track[index]);
        frameIndices.push(index);
      }
    }
    const ribbon = new THREE.BufferGeometry();
    ribbon.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    ribbon.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(new Float32Array(positions.length), 3),
    );
    this.pathFrames = frameIndices;
    this.pathTube = new THREE.Mesh(
      ribbon,
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.27,
        depthWrite: false,
      }),
    );
    scene.add(this.pathTube);
    this.pathEdge = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(D.map(V)),
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      }),
    );
    this.pathEdge.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(new Float32Array(D.length * 3), 3),
    );
    scene.add(this.pathEdge);
    this.metricArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
      0.5,
      GOLD,
      0.08,
      0.035,
    );
    this.referenceArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(),
      0.4,
      0x6bbcff,
      0.06,
      0.025,
    );
    this.angleArc = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: GOLD,
        transparent: true,
        opacity: 0.95,
      }),
    );
    scene.add(this.metricArrow, this.referenceArrow, this.angleArc);
    this.comPlumb = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([V(S[0]), V(S[0])]),
      new THREE.LineDashedMaterial({
        color: 0x71d6aa,
        dashSize: 0.045,
        gapSize: 0.025,
        transparent: true,
        opacity: 0.8,
      }),
    );
    this.comGround = new THREE.Mesh(
      new THREE.RingGeometry(0.025, 0.038, 32),
      new THREE.MeshBasicMaterial({ color: 0x71d6aa, side: THREE.DoubleSide }),
    );
    this.comTrail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        data.body.com.map(
          (p) => new THREE.Vector3(p[0], p[1], this.GROUND + 0.004),
        ),
      ),
      new THREE.LineBasicMaterial({
        color: 0x71d6aa,
        transparent: true,
        opacity: 0.35,
      }),
    );
    scene.add(this.comPlumb, this.comGround, this.comTrail);
    this.metricId = "bat_speed";
    this.setMetric(this.metricId);

    // Illustrative ball flight is driven by the same contact-aligned clock.
    this.contact = new THREE.Mesh(
      new THREE.SphereGeometry(0.037, 24, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }),
    );
    for (const offset of [-1, 1]) {
      const points = Array.from({ length: 65 }, (_, i) => {
        const a = (i / 64) * Math.PI * 2;
        return new THREE.Vector3(
          0.027 * Math.cos(a),
          0.027 * Math.sin(a),
          offset * 0.025,
        );
      });
      this.contact.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color: 0xc53d38 }),
        ),
      );
    }
    scene.add(this.contact);

    // bat
    const ci = data.contact_index;
    this.batLen = V(D[ci]).distanceTo(V(O[ci]));
    this.bat = (() => {
      const geo = new THREE.CylinderGeometry(0.03, 0.012, this.batLen, 14, 1);
      geo.rotateX(Math.PI / 2);
      geo.translate(0, 0, this.batLen / 2);
      const pos = geo.attributes.position,
        colors = [];
      const cA = new THREE.Color(ATHENS),
        cB = new THREE.Color(GOLD),
        tmp = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const t = Math.max(0, Math.min(1, pos.getZ(i) / this.batLen));
        tmp.copy(cA).lerp(cB, t);
        colors.push(tmp.r, tmp.g, tmp.b);
      }
      geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.4,
          metalness: 0.15,
        }),
      );
      scene.add(mesh);
      return mesh;
    })();
    this.knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 12, 12),
      new THREE.MeshStandardMaterial({ color: TRACK }),
    );
    this.sweet = new THREE.Mesh(
      new THREE.SphereGeometry(0.019, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: GOLD,
        emissiveIntensity: 0.5,
      }),
    );
    scene.add(this.knob, this.sweet);

    // body: one thin cylinder per link, repositioned each frame
    this.bodyGroup = new THREE.Group();
    const boneMat = new THREE.MeshStandardMaterial({
      color: BODY,
      roughness: 0.6,
      metalness: 0.05,
    });
    this.bodyLinks = data.links.map(([a, b]) => ({ a, b }));
    for (let i = 0; i < this.bodyLinks.length; i++) {
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(0.013, 0.013, 1, 8),
        boneMat.clone(),
      );
      m.userData.i = i;
      this.bodyGroup.add(m);
      this._bones.push(m);
    }
    this.comDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 12, 12),
      new THREE.MeshStandardMaterial({
        color: CHROME,
        emissive: GOLD,
        emissiveIntensity: 0.1,
      }),
    );
    this.bodyGroup.add(this.comDot);
    scene.add(this.bodyGroup);

    // joint dots at every point, so the skeleton reads as markers, not sticks
    this.jointGeo = new THREE.BufferGeometry();
    const nJoints = Object.keys(data.body).length;
    this.jointGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(new Float32Array(nJoints * 3), 3),
    );
    this.joints = new THREE.Points(
      this.jointGeo,
      new THREE.PointsMaterial({
        color: CHROME,
        size: 0.016,
        sizeAttenuation: true,
      }),
    );
    this.bodyGroup.add(this.joints);
    this.jointKeys = Object.keys(data.body);

    this._axisRanges = null;
    Object.entries(this.layers).forEach(([name, on]) =>
      this.setLayer(name, on),
    );
    this.setIndex(Math.round(T.length * 0.25));
    return this;
  }

  idxForT(t) {
    const T = this.data.t_ms;
    let best = 0,
      bd = Infinity;
    T.forEach((v, i) => {
      const d = Math.abs(v - t);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    return best;
  }

  anchor(spec, idx) {
    const { origin, distal, sweet } = this.data;
    switch (spec.kind) {
      case "hands":
        return V(this.data.hand[idx]);
      case "knob":
        return V(origin[idx]).lerp(V(distal[idx]), 0.17);
      case "barrel":
        return V(distal[idx]);
      case "sweet":
        return V(sweet[idx]);
      case "window": {
        const mid = (spec.win[0] + spec.win[1]) / 2;
        return V(sweet[this.idxForT(mid)]);
      }
      case "seg": {
        const p = this.data.body[spec.seg + "_prox"];
        const d = this.data.body[spec.seg + "_dist"];
        if (!p || !d) return V(this.data.body.com[idx]);
        return V(p[idx]).lerp(V(d[idx]), 0.5);
      }
      default:
        return V(sweet[idx]);
    }
  }

  setIndex(idx) {
    if (!this.data) return;
    const { origin, distal, sweet, hand, body } = this.data;
    // Reveal only completed strips and barrel samples through the current frame.
    // Drawing from the timeline index also handles scrubbing, rewind, and loops.
    this.pathTube.geometry.setDrawRange(0, idx * 6);
    this.pathEdge.geometry.setDrawRange(0, idx > 0 ? idx + 1 : 0);
    this.contact.position
      .copy(V(ballPosition(this.data.t_ms[idx])))
      .add(V(sweet[this.data.contact_index]));
    this.contact.rotation.y = this.data.t_ms[idx] * 0.008;
    const o = V(origin[idx]),
      d = V(distal[idx]);
    const dirv = d.clone().sub(o);
    this.bat.quaternion.setFromUnitVectors(
      this._zAxis,
      dirv.clone().normalize(),
    );
    this.bat.position.copy(o);
    this.knob.position.copy(o);
    this.sweet.position.copy(V(sweet[idx]));

    this._bones.forEach((bone, i) => {
      const { a, b } = this.bodyLinks[i];
      const pa = body[a][idx],
        pb = body[b][idx];
      this._tmpA.set(pa[0], pa[1], pa[2]);
      this._tmpB.set(pb[0], pb[1], pb[2]);
      const len = this._tmpA.distanceTo(this._tmpB) || 1e-4;
      bone.position.copy(this._tmpA).add(this._tmpB).multiplyScalar(0.5);
      bone.scale.set(1, len, 1);
      const dir = this._tmpB.clone().sub(this._tmpA).normalize();
      bone.quaternion.setFromUnitVectors(this._yAxis, dir);
    });

    this.comDot.position.copy(V(body.com[idx]));
    const com = V(body.com[idx]),
      foot = com.clone();
    foot.z = this.GROUND + 0.006;
    this.comGround.position.copy(foot);
    this.comPlumb.geometry.setFromPoints([com, foot]);
    this.comPlumb.computeLineDistances();
    this.updateMeasurement(idx);

    const arr = this.jointGeo.attributes.position.array;
    this.jointKeys.forEach((k, i) => {
      const p = body[k][idx];
      arr[i * 3] = p[0];
      arr[i * 3 + 1] = p[1];
      arr[i * 3 + 2] = p[2];
    });
    this.jointGeo.attributes.position.needsUpdate = true;
    this.jointGeo.computeBoundingSphere();
  }

  setLayer(name, on) {
    this.layers[name] = on;
    if (name === "body") this.bodyGroup.visible = on;
    if (name === "path") {
      this.pathTube.visible = on;
      this.pathEdge.visible = on;
    }
    if (name === "plane") this.plane.visible = on;
    if (name === "zone") this.zone.visible = on;
    if (name === "ground") this.grid.visible = on;
  }

  setMetric(id) {
    this.metricId = id;
    this.setHighlight(this.highlightAnchor);
    if (this.bat) {
      this.bat.material.vertexColors = id !== "sequencing";
      this.bat.material.color.set(id === "sequencing" ? 0xb6b6b6 : 0xffffff);
      this.bat.material.needsUpdate = true;
    }
    const values = [
      "bat_speed",
      "hand_speed",
      "haa",
      "vaa",
      "vba",
      "connection",
    ].includes(id)
      ? this.data.signals[id]
      : null;
    const valid = values?.filter((v) => v !== null && Number.isFinite(v));
    this.pathTube.material.opacity = valid?.length ? 0.22 : 0.1;
    this.metricRange = valid?.length
      ? [Math.min(...valid), Math.max(...valid)]
      : null;
    const colorAt = (k) => {
      if (
        !this.metricRange ||
        values[k] === null ||
        !Number.isFinite(values[k])
      )
        return new THREE.Color(0x565d65);
      const [lo, hi] = this.metricRange;
      const fraction = (values[k] - lo) / (hi - lo || 1);
      return fraction <= 0.5
        ? new THREE.Color(0x3288ff).lerp(new THREE.Color(0x36ce75), fraction * 2)
        : new THREE.Color(0x36ce75).lerp(new THREE.Color(0xff4040), (fraction - 0.5) * 2);
    };
    const attr = this.pathTube.geometry.attributes.color;
    this.pathFrames.forEach((k, i) => {
      const c = colorAt(k);
      attr.setXYZ(i, c.r, c.g, c.b);
    });
    attr.needsUpdate = true;
    const edge = this.pathEdge.geometry.attributes.color;
    for (let k = 0; k < edge.count; k++) {
      const c = colorAt(k);
      edge.setXYZ(k, c.r, c.g, c.b);
    }
    edge.needsUpdate = true;
  }

  updateMeasurement(idx) {
    const id = this.metricId,
      d = this.data;
    // Use the exhibit's downswing boundary (foot-plant proxy).
    if (d.t_ms[idx] < d.events_ms.fp_time) {
      this.metricArrow.visible = false;
      this.referenceArrow.visible = false;
      this.angleArc.visible = false;
      return;
    }
    const barrel = (k) =>
      V(d.distal[k]).add(
        V(d.origin[k]).sub(V(d.distal[k])).normalize().multiplyScalar(0.1524),
      );
    const axis = V(d.distal[idx]).sub(V(d.origin[idx])).normalize();
    const before = Math.max(0, idx - 1),
      after = Math.min(d.t_ms.length - 1, idx + 1);
    const velocity = (track) =>
      track(after)
        .sub(track(before))
        .multiplyScalar(1000 / (d.t_ms[after] - d.t_ms[before]));
    let origin = barrel(idx),
      direction,
      reference,
      length = 0.48;
    if (id === "bat_speed") {
      origin = V(d.sweet[idx]);
      direction = velocity((k) => V(d.sweet[k]));
      length = Math.max(0.12, Math.min(0.8, direction.length() * 0.028));
    }
    if (id === "hand_speed") {
      origin = V(d.hand[idx]);
      direction = velocity((k) => V(d.hand[k]));
    }
    if (id === "haa") {
      origin = V(d.sweet[idx]);
      direction = velocity((k) => V(d.sweet[k]));
      reference = direction.clone();
      reference.y = 0;
    }
    if (id === "vaa") {
      direction = velocity(barrel);
      reference = direction.clone();
      reference.z = 0;
    }
    if (id === "vba") {
      origin = V(d.distal[idx]);
      direction = axis;
      reference = axis.clone();
      reference.z = 0;
    }
    if (id === "connection") {
      origin = V(d.origin[idx]);
      direction = axis;
      reference = V(d.body.rta_prox[idx]).sub(V(d.body.rta_dist[idx]));
    }
    const valid =
      direction && direction.length() > 1e-5 && d.signals[id]?.[idx] !== null;
    this.metricArrow.visible = !!valid;
    this.referenceArrow.visible = !!(valid && reference?.length() > 1e-5);
    this.angleArc.visible = this.referenceArrow.visible;
    if (!valid) return;
    direction.normalize();
    this.metricArrow.position.copy(origin);
    this.metricArrow.setDirection(direction);
    this.metricArrow.setLength(length, 0.07, 0.03);
    if (!this.referenceArrow.visible) return;
    reference.normalize();
    this.referenceArrow.position.copy(origin);
    this.referenceArrow.setDirection(reference);
    this.referenceArrow.setLength(0.42, 0.055, 0.022);
    const theta = Math.acos(
      THREE.MathUtils.clamp(reference.dot(direction), -1, 1),
    );
    const normal = new THREE.Vector3().crossVectors(reference, direction);
    if (normal.length() < 1e-6) {
      this.angleArc.visible = false;
      return;
    }
    normal.normalize();
    const points = Array.from({ length: 33 }, (_, i) =>
      reference
        .clone()
        .applyAxisAngle(normal, (theta * i) / 32)
        .multiplyScalar(0.24)
        .add(origin),
    );
    this.angleArc.geometry.dispose();
    this.angleArc.geometry = new THREE.BufferGeometry().setFromPoints(points);
  }

  setView(preset) {
    const presets = {
      catcher: new THREE.Vector3(-0.85, -1.0, 0.62),
      side: new THREE.Vector3(-0.1, -1.6, 0.35),
      top: new THREE.Vector3(-0.2, -0.35, 1.6),
    };
    const dir = presets[preset] || presets.catcher;
    const dist =
      this.camera.position.distanceTo(V(this.target)) || this.RAD * 2.4;
    this.camera.position.copy(
      V(this.target).add(dir.normalize().multiplyScalar(dist)),
    );
    this.controls.update();
  }

  resetView() {
    this.controls.target.copy(V(this.target));
    this.camera.position.copy(
      V(this.target).add(
        new THREE.Vector3(-0.85, -1, 0.62)
          .normalize()
          .multiplyScalar(this.defaultDistance),
      ),
    );
    this.controls.update();
  }

  setHighlight(anchor) {
    this.highlightAnchor = anchor;
    this._bones.forEach((bone, i) => {
      const link = this.bodyLinks[i];
      const segmentIndex = sequencingSegments.findIndex(
        (seg) => link.a.startsWith(seg + "_") && link.b.startsWith(seg + "_"),
      );
      const active =
        (this.metricId === "separation" &&
          [link.a, link.b].some((k) => /^(rpv|rta)_/.test(k))) ||
        (anchor?.kind === "seg" &&
          [link.a, link.b].some((k) => k.startsWith(anchor.seg + "_")));
      const color =
        this.metricId === "sequencing"
          ? segmentIndex >= 0
            ? seriesColors[segmentIndex]
            : "#d5d5d5"
          : active
            ? GOLD
            : BODY;
      bone.material.color.set(color);
      bone.material.emissive.set(color);
      bone.material.emissiveIntensity =
        this.metricId === "sequencing" && segmentIndex >= 0
          ? 0.3
          : active
            ? 0.1
            : 0;
    });
    this.comDot?.material.color.setHex(anchor?.seg === "com" ? GOLD : CHROME);
  }

  project(v) {
    const p = v.clone().project(this.camera);
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (p.x * 0.5 + 0.5) * r.width,
      y: (-p.y * 0.5 + 0.5) * r.height,
      behind: p.z > 1,
    };
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    const w = r.width,
      h = Math.max(1, r.height);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const o = this.overlay;
    o.width = Math.round(w * dpr);
    o.height = Math.round(h * dpr);
    o.style.width = w + "px";
    o.style.height = h + "px";
    o.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    this._w = w;
    this._h = h;
  }

  get width() {
    return this._w || 1;
  }
  get height() {
    return this._h || 1;
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
