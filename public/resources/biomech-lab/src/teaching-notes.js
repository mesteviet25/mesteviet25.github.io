export const teachingNotes = {
  "bat_speed": {
    "definition": "Bat speed tells you how fast the sweet spot is moving, in miles per hour. Follow the curve to see when the barrel gains speed and whether its peak comes before or after contact.",
    "read": "Blast measures sweet-spot speed at contact, six inches from the bat’s tip. The star marks that moment on the curve. Contact speed and peak speed can be different.",
    "notes": [
      "A faster barrel gives a hitter the potential for harder contact. Exit velocity also depends on where and how the bat meets the ball. Compare contact speed with the curve’s peak and the time between them.",
      "HTKC describes the pelvis, torso, arms, hands, and bat working together. Compare swings with similar bats and contact locations before attributing a speed change to one body segment. The gold arrow follows the sweet spot.",
      "Each swing’s speed is calculated before averaging. The visible bat follows an average path, so its apparent speed can differ from the mean speed on the graph."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 23-24, 30-39, 53-54.",
    "sources": [
      [
        "Driveline: Hitting Biomechanics",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics"
      ],
      [
        "Blast: Baseball metric definitions",
        "https://blast-motion.helpjuice.com/what-are-the-blast-baseball-metrics-47-version"
      ]
    ],
    "readLabel": "How Blast measures it"
  },
  "vaa": {
    "definition": "Vertical attack angle (VAA) describes whether the barrel travels up or down. Positive means upward, negative means downward, and zero means level with the ground. Contact depth and pitch height affect the angle.",
    "read": "Blast’s Attack Angle is the angle of the bat’s path relative to horizontal at contact. The star marks that sample. The curve shows how the direction changes around it.",
    "notes": [
      "Attack angle describes barrel movement. Vertical bat angle describes the shaft’s tilt. HTKC places the barrel reference six inches from the end cap. Gold follows its travel direction; blue shows the horizontal projection.",
      "Later contact on the same swing arc can produce a different attack angle. HTKC uses this to explain why a sensor reading may increase as a hitter adjusts to machine timing, even when the path stays similar. Compare contact points and pitch locations when assessing a change.",
      "The ball’s launch angle also depends on pitch trajectory and the collision. A positive attack angle alone does not establish a good contact result."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 48, 51-55.",
    "sources": [
      [
        "Driveline: Barrel Direction",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics-barrel-direction"
      ],
      [
        "Blast: Baseball metric definitions",
        "https://blast-motion.helpjuice.com/what-are-the-blast-baseball-metrics-47-version"
      ]
    ],
    "readLabel": "How Blast measures it"
  },
  "haa": {
    "definition": "Horizontal attack angle (HAA) describes the direction of barrel travel. Positive is toward the opposite field; negative is toward the pull side. Compare it with contact depth and pitch location.",
    "read": "Blast’s Attack Angle describes up-or-down travel. This lab HAA curve adds the pull-side and opposite-field direction. The contact star gives you a common moment for comparing them.",
    "notes": [
      "HAA describes where the barrel is moving. Horizontal bat angle describes where the shaft points, and spray angle describes where the ball goes. Those measurements answer different coaching questions. This exhibit uses opposite-field-positive signs, the reverse of the convention in Driveline’s linked 2022 article.",
      "The curve follows the lab report’s lateral-inclination definition: atan2(lateral velocity, the magnitude of forward and vertical velocity). Gold shows sweet-spot velocity; blue shows its forward-and-vertical projection. This differs from a purely overhead heading when the barrel travels steeply downward.",
      "The formula was checked against stored lab velocities and HAA values. Native-frame measurements are calculated for each swing before averaging. Stationary or missing samples remain blank; direction during slow motion is less stable."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 49-53.",
    "sources": [
      [
        "Driveline: Barrel Direction",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics-barrel-direction"
      ],
      [
        "Blast: Baseball metric definitions",
        "https://blast-motion.helpjuice.com/what-are-the-blast-baseball-metrics-47-version"
      ]
    ],
    "readLabel": "Alongside Blast"
  },
  "vba": {
    "definition": "Vertical bat angle (VBA) describes the shaft’s tilt. A level bat is 0°. When the barrel is below the handle, the angle is negative; closer to −90° means more vertical. Pitch height and torso posture help explain that position.",
    "read": "Blast measures the bat’s angle relative to horizontal at contact. The star marks that position. Compare it with attack angle to see both the bat’s tilt and its direction of travel.",
    "notes": [
      "HTKC describes a flatter bat orientation for higher pitches and a more vertical orientation for lower pitches. Forward bend and side bend also affect VBA. Use the pitch and hitter’s posture to interpret the angle.",
      "Gold follows the handle-to-barrel axis; blue shows its horizontal projection. Compare this view with VAA at the same frame to separate shaft position from travel direction.",
      "HTKC discusses how flatter and more vertical paths affect contact-point tolerance and batted-ball distribution. VBA provides context for those tradeoffs, but the angle alone cannot establish the outcome."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 50-53, 57-58.",
    "sources": [
      [
        "Driveline: Barrel Direction",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics-barrel-direction"
      ],
      [
        "Blast: Vertical Bat Angle",
        "https://blastmotion.com/blog/what-is-vertical-bat-angle-in-a-baseball-swing/"
      ]
    ],
    "readLabel": "How Blast measures it"
  },
  "hand_speed": {
    "definition": "Hand speed tracks how fast the hand/handle reference moves through space, in mph. Compare its timing with bat speed to see how the handle and barrel move through the swing.",
    "read": "Blast’s Peak Hand Speed is the maximum speed measured six inches from the knob, before contact. Here, the star marks the peak of the average curve; individual swings can peak at different times.",
    "notes": [
      "HTKC describes the wrists retaining lag early in torso rotation, then releasing as the barrel accelerates. Hand speed helps you examine the timing of that movement. Wrist angles and grip action require other measurements.",
      "The hand and barrel follow different paths, so faster hands at every frame are not a universal goal. Watch the motion while comparing the curves. The sequencing graph measures hand rotation in degrees per second; this graph measures linear speed in mph.",
      "This curve uses the lab’s tracked hand reference. Blast places the peak near the point when the wrists unhinge. The maximum here is the peak of an average curve, which can differ from both the average of individual peaks and Blast’s sensor-derived Peak Hand Speed."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 23-24, 36-40.",
    "sources": [
      [
        "Driveline: Hitting Biomechanics",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics"
      ],
      [
        "Blast: Peak Hand Speed",
        "https://blastmotion.com/blog/what-is-hand-speed-in-a-baseball-swing/"
      ]
    ],
    "readLabel": "How Blast measures it"
  },
  "connection": {
    "definition": "Connection describes the relationship between body tilt and bat angle. A right angle is 90°. Watch how that relationship changes as the hitter starts the swing and moves into contact.",
    "read": "Blast samples Early Connection at downswing initiation and Connection at Impact at contact. Both compare body tilt with vertical bat angle. This exhibit’s early star uses foot plant as an approximate reference.",
    "notes": [
      "Blast’s downswing event comes from its detection algorithm. Foot plant can occur at a different time, so the early star here is a proxy. The contact star uses the exhibit’s contact frame.",
      "Driveline uses roughly perpendicular body-and-bat alignment as a coaching reference for connection. Sensor ranges apply at the specified measurement event; the angle changes through the rest of the swing.",
      "The exhibit compares the shoulder-to-pelvis torso direction with the handle-to-barrel direction. Blue shows the torso direction moved to the handle, and gold follows the bat. This reconstruction uses motion capture rather than Blast’s proprietary calculation.",
      "HTKC also uses connection to describe the torso, lead arm, and hand moving together early in the swing. Watch those segments and the sequencing graph to assess that coordination; the angle alone cannot show it."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 23-24, 29, 36-39.",
    "sources": [
      [
        "Driveline: Early Connection",
        "https://drivelinebaseball.com/blogs/blog/early-connection-metric"
      ],
      [
        "Blast: Baseball metric definitions",
        "https://blast-motion.helpjuice.com/what-are-the-blast-baseball-metrics-47-version"
      ]
    ],
    "readLabel": "How Blast measures it"
  },
  "pelvis_3d": {
    "definition": "These curves show how the pelvis tilts forward or backward (x), tilts to the side (y), and rotates (z). Each value is an angle. Together they describe the pelvis’s orientation through the swing.",
    "read": "Follow the hips through load and foot plant, then compare their turn with the torso. Watch how the tilt changes while the pelvis rotates.",
    "notes": [
      "Position and speed answer different questions. A pelvis can be turned substantially while rotating slowly. The sequencing graph shows how fast it passes through each position.",
      "HTKC describes pelvis rotation into foot plant, followed by changes in posterior tilt and side bend. Reading all three curves gives more context than a single hip-turn number.",
      "The curves retain the lab’s axis definitions and signs. They measure pelvis orientation; hip-joint flexion, ground forces, and weight distribution require separate measurements."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 15-16, 30-33.",
    "sources": [
      [
        "Driveline: Hitting Biomechanics",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics"
      ]
    ]
  },
  "torso_3d": {
    "definition": "The torso curves show forward bend (x), side bend (y), and rotation (z). Read them together to follow the hitter’s posture and turn from load through contact.",
    "read": "Watch the torso coil during the load, then rotate and change side bend during the swing. Compare those changes with pitch height and the pelvis’s motion.",
    "notes": [
      "Forward bend and side bend describe motion in different planes. HTKC explains how side bend helps hitters adjust to pitch height. Maintaining posture allows those angles to change through the swing.",
      "Compare the torso with the pelvis around foot plant and contact. These curves show global orientations. The lab calculates pelvis-torso separation separately, so subtracting the displayed angles may not reproduce that measurement.",
      "The lab’s signs are preserved. Each curve averages angles measured per swing; a visual estimate from the average skeleton can differ. Rotational speed appears on the sequencing graph."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 12, 15-16, 23, 34-35.",
    "sources": [
      [
        "Driveline: Hitting Biomechanics",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics"
      ]
    ]
  },
  "sequencing": {
    "definition": "Sequencing shows how fast the pelvis, torso, lead upper arm, and lead hand rotate. The colors match the body segments. Compare when each curve rises and peaks as the swing moves toward contact.",
    "read": "HTKC describes speed developing from pelvis to torso, then arm and hand. Watch how their motion overlaps. Averaging can shift the peaks, so this curve cannot establish any one hitter’s sequence.",
    "notes": [
      "HTKC describes one segment slowing as the next gains speed. Scrub through the curves to examine that timing. Four peak values alone leave out much of the movement.",
      "Pelvis and torso use signed z-axis angular velocity. Lead arm and hand use the three-axis magnitudes from the lab’s lead-elbow and lead-wrist channels. All are in degrees per second, though axis velocity and total magnitude describe different quantities. Linear hand speed has its own graph in mph.",
      "Timing differences between swings can smooth or shift the peaks in this average. These curves measure movement. Energy transfer, joint torques, and ground forces need additional measurements."
    ],
    "book": "HTKC: Hitting Biomechanics, PDF pp. 23-24, 30-40.",
    "sources": [
      [
        "Driveline: Hitting Biomechanics",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics"
      ]
    ]
  },
  "separation": {
    "definition": "Hip-shoulder separation describes how the torso is rotated relative to the pelvis. Follow the angle from load through contact to see how the upper and lower body turn in relation to each other.",
    "read": "Watch how separation develops during load and stride, then changes as the torso turns toward contact. Compare its timing with the pelvis and torso curves on the sequencing graph.",
    "notes": [
      "This plot uses the lab’s torso-relative-to-pelvis rotation channel. It is calculated for each swing before averaging, so subtracting the two average global rotation curves may give a different result.",
      "Read the signed angle using the lab’s convention. A larger gap alone does not establish more stored energy or a better swing. Consider when the angle develops and closes alongside the hitter’s movement."
    ],
    "book": "HTKC: Hitting Biomechanics. See the pelvis, torso, and sequencing discussions.",
    "sources": [
      [
        "Driveline: Hitting Biomechanics",
        "https://drivelinebaseball.com/blogs/blog/hitting-biomechanics"
      ]
    ]
  }
};
