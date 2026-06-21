// ─── Intermediate Program (existing PPL) ─────────────────────────────────────

const WORKOUTS_INTERMEDIATE = {
  'push-a': {
    label: 'Push Day A',
    focus: 'Chest · Shoulders · Triceps',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '6–8', rest: '3 min', muscles: 'Pectoralis major, anterior deltoid, triceps brachii', cue: 'Retract and depress scapulae before unracking. Drive bar off chest explosively. Control the descent for 2 seconds — the eccentric builds as much muscle as the press.', progression: 'Add 5 lb total when all 4 sets reach 8 clean reps. Deload 10% if form breaks down before hitting the top of the range.' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10–12', rest: '2 min', muscles: 'Upper pectoralis major, anterior deltoid, triceps', cue: 'Set bench to 30–45°. Elbows at 45° to torso — do not flare. Press in a slight arc inward at the top. More ROM than barbell variation.', progression: 'Increase by 2.5 lb per side when 3 sets hit 12 reps with full control.' },
      { name: 'Cable Lateral Raise', sets: 4, reps: '15', rest: '90 sec', muscles: 'Lateral deltoid, supraspinatus', cue: 'Lead with the elbow, not the wrist. Stop at shoulder height. Slight forward lean improves the abduction angle and reduces trap involvement.', progression: 'Small jumps only (1–2 lb). Form is the priority — swinging invalidates the set.' },
      { name: 'Dumbbell Overhead Press', sets: 3, reps: '10–12', rest: '2 min', muscles: 'Anterior and lateral deltoid, upper trapezius, triceps', cue: 'Brace the core hard. Press from ear height, not in front of face. Avoid excessive lumbar extension — it turns a shoulder exercise into a back exercise.', progression: 'Add 2.5 lb per side when 3 sets hit 12 reps.' },
      { name: 'Rope Tricep Pushdown', sets: 3, reps: '12–15', rest: '90 sec', muscles: 'Triceps brachii (all three heads)', cue: 'Split the rope at the bottom. Keep upper arms pinned to your sides throughout — any movement of the elbows reduces tricep isolation.', progression: 'Add 5 lb when 3 sets hit 15 reps comfortably.' },
      { name: 'Overhead Tricep Extension (EZ Bar)', sets: 3, reps: '12', rest: '90 sec', muscles: 'Triceps brachii long head', cue: 'Keep elbows close to head. Lower bar behind head until full stretch is felt in the long head. Press straight up by extending at the elbow — do not flare.', progression: 'Add 2.5–5 lb when 3 sets hit 12 clean reps.' },
    ],
    nutrition: 'Push days are high CNS output. Target 40–50g protein post-session within 45 minutes. Pair with 60–80g fast-digesting carbs (white rice, banana, white potato) to replenish glycogen. Total daily protein: 0.8–1g per lb of bodyweight. Do not skip the post-workout window on heavy push days.',
    rationale: 'Compound press leads to prime the nervous system at peak freshness. Incline and overhead work follow in decreasing intensity order. Lateral raises and tricep isolation are done last with higher reps to maximize hypertrophic stimulus after the heavy compound has already recruited maximum motor units.',
  },
  'pull-a': {
    label: 'Pull Day A',
    focus: 'Back · Biceps · Rear Delts',
    exercises: [
      { name: 'Barbell Row (Overhand)', sets: 4, reps: '6–8', rest: '3 min', muscles: 'Latissimus dorsi, middle trapezius, rhomboids, rear deltoid, biceps brachii', cue: 'Hip hinge to ~45°. Pull bar to lower chest or upper abdomen. Lead with elbows, not hands. Keep back flat — any rounding transfers load off the target muscles.', progression: 'Add 5 lb when all 4 sets hit 8 reps. Reset form check before adding load.' },
      { name: 'Lat Pulldown (Wide Grip)', sets: 3, reps: '10–12', rest: '2 min', muscles: 'Latissimus dorsi, teres major, biceps brachii', cue: 'Slight lean back. Pull bar to upper chest. Initiate by depressing the scapulae before bending elbows — this is the difference between a back exercise and an arm exercise.', progression: 'Add 5–10 lb when 3 sets hit 12 reps.' },
      { name: 'Cable Row (Narrow Neutral Grip)', sets: 3, reps: '12', rest: '90 sec', muscles: 'Middle trapezius, rhomboids, rear deltoid, biceps', cue: 'Sit tall — do not rock the torso. Pull handle to lower abdomen. Pause at the peak and squeeze shoulder blades together for 1 full second.', progression: 'Add 5–10 lb when 3 sets hit 12 smooth reps.' },
      { name: 'Face Pull (Rope)', sets: 4, reps: '15', rest: '90 sec', muscles: 'Rear deltoid, external rotators, mid and lower trapezius', cue: 'Set cable at or above head height. Pull rope to forehead, splitting it apart at the end. Externally rotate at the top. Non-negotiable for shoulder health — counteracts the anterior dominance of push days.', progression: 'Keep weight conservative. Rep quality and external rotation range matter more than load.' },
      { name: 'EZ Bar Curl', sets: 3, reps: '10–12', rest: '90 sec', muscles: 'Biceps brachii, brachialis', cue: 'Keep upper arms pinned to sides. Curl through full range of motion. Lower slowly — 2 to 3 seconds on the eccentric. The negative builds as much as the curl.', progression: 'Add 2.5–5 lb when 3 sets hit 12 reps.' },
      { name: 'Hammer Curl (Alternating)', sets: 3, reps: '12/side', rest: '90 sec', muscles: 'Brachialis, brachioradialis, biceps long head', cue: 'Neutral grip, palms facing torso. Alternate arms. Keep wrists locked — no rotation. The brachialis sits under the bicep and pushes it up when developed.', progression: 'Add 2.5 lb per side when all reps are controlled on both sides.' },
    ],
    nutrition: 'Pull sessions tax the posterior chain heavily. Eat 30–60g carbs 30–60 min pre-session (oats, rice, fruit). Post-session: 40–50g protein plus complex carbs. Omega-3s (2–3g EPA/DHA daily) reduce systemic inflammation and improve back-to-back session recovery.',
    rationale: 'Barbell row anchors the session with the heaviest horizontal pull stimulus. Lat pulldown adds vertical pulling volume. Cable row reinforces the horizontal plane at higher reps. Face pulls are non-negotiable — they correct the anterior dominance built during push days and protect the shoulder joint against long-term impingement.',
  },
  'legs-a': {
    label: 'Legs Day A',
    focus: 'Quads · Hamstrings · Glutes',
    exercises: [
      { name: 'Barbell Back Squat', sets: 4, reps: '6–8', rest: '3–4 min', muscles: 'Quadriceps, gluteus maximus, hamstrings, adductors, erector spinae', cue: 'Bar on mid-traps. Brace core 360° — not just the abs, the entire cylinder. Sit between heels, not back. Break parallel. Drive knees out in line with toes on the ascent.', progression: 'Add 5 lb when all 4 sets hit 8 reps. The squat is slow to progress — do not rush or compromise depth for load.' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10–12', rest: '2–3 min', muscles: 'Hamstrings, gluteus maximus, erector spinae', cue: 'Hinge at the hip. Bar slides down the legs. Feel the hamstring stretch at the bottom — this is the stimulus. Do not round the lower back. Return by driving hips forward, not by pulling with the back.', progression: 'Add 5–10 lb when 3 sets hit 12 reps with a controlled 3-second eccentric.' },
      { name: 'Leg Press', sets: 3, reps: '12–15', rest: '2 min', muscles: 'Quadriceps, gluteus maximus', cue: 'High and wide foot placement for more glute activation; low and narrow for more quad. Do not lock out the knees. Control the descent — sled speed reveals load management.', progression: 'Add 10–20 lb per side when 3 sets hit 15 reps.' },
      { name: 'Lying Leg Curl (Machine)', sets: 3, reps: '12–15', rest: '90 sec', muscles: 'Biceps femoris, semimembranosus, semitendinosus', cue: 'Plantarflex (point toes down) to maximize hamstring shortening. Full ROM. Hold peak contraction 1 second — do not let the weight stack bounce.', progression: 'Add 5 lb when all sets hit 15 clean reps.' },
      { name: 'Standing Calf Raise', sets: 4, reps: '15–20', rest: '60 sec', muscles: 'Gastrocnemius, soleus', cue: 'Full stretch at the bottom — pause for 1 second. Full contraction at the top. Calves respond to full ROM, not partial reps. Bouncing is wasted effort.', progression: 'Add 5–10 lb when all 4 sets hit 20 reps with full ROM.' },
      { name: 'Goblet Squat (Finisher)', sets: 2, reps: '15–20', rest: '60 sec', muscles: 'Quadriceps, glutes, adductors', cue: 'Light weight. Elbows inside knees at the bottom. Use as a metabolic flush — the goal is blood flow and mind-muscle connection, not additional stimulus.', progression: 'Not a progression movement. Control and feel are the only metrics here.' },
    ],
    nutrition: 'Leg day is your highest caloric demand session. Increase total carbohydrates by 20–30% on leg training days. Pre-session: slow carbs 1–2 hours before. Intra-session: water and electrolytes for sessions over 60 min. Post-session: prioritize protein and fast carbs within 45 minutes — the glycogen depletion window is real.',
    rationale: 'Squat anchors the session with maximum motor unit recruitment across the entire lower body. RDL provides posterior chain balance critical for knee health and prevents quad dominance developing into injury. Machine work follows to accumulate hypertrophic volume without further taxing the CNS. Calf work goes last — often untrained — and requires high volume to respond because the soleus and gastrocnemius are endurance-adapted muscles.',
  },
  'core': {
    label: 'Core & Mobility Day',
    focus: 'Stability · Anti-Rotation · Flexibility',
    exercises: [
      { name: 'Dead Bug', sets: 3, reps: '10/side', rest: '60 sec', muscles: 'Transverse abdominis, diaphragm, rectus abdominis', cue: 'Press lower back flat to floor — maintain this throughout. Opposite arm and leg extend simultaneously and slowly. Do not let the lower back arch at any point.', progression: 'Add a light dumbbell held in the extended hand when 10 reps per side feels easy.' },
      { name: 'Pallof Press (Cable)', sets: 3, reps: '12/side', rest: '60 sec', muscles: 'Transverse abdominis, obliques, glutes', cue: 'Stand perpendicular to the cable. Press straight out, hold 1 second, return. The cable wants to rotate your torso — resisting that rotation is the exercise. No twisting.', progression: 'Add weight when all reps show zero torso rotation at full extension.' },
      { name: 'Ab Wheel Rollout', sets: 3, reps: '8–10', rest: '90 sec', muscles: 'Rectus abdominis, hip flexors, latissimus dorsi', cue: 'Brace hard before rolling. Only extend as far as you can maintain a neutral spine — the lower back arching is the failure point. Pull back using the lats. Start from knees; progress to standing.', progression: 'Add reps or increase roll distance. Full standing rollout is the end goal.' },
      { name: 'Copenhagen Plank', sets: 3, reps: '30 sec/side', rest: '60 sec', muscles: 'Hip adductors, obliques, glute medius', cue: 'Top foot on a bench, bottom leg hovering. Hold body in a rigid line. This trains the adductors as stabilizers — a frequently neglected capacity that matters for squats and single-leg work.', progression: 'Increase to 45 seconds, then 60 seconds per side.' },
      { name: 'Hip Flexor Stretch (90/90)', sets: 3, reps: '60 sec/side', rest: '30 sec', muscles: 'Psoas, iliacus, rectus femoris', cue: 'Front shin perpendicular to torso, back leg in line. Tuck the pelvis (posterior tilt) before leaning forward — this is what makes it a hip stretch rather than a lower back compression.', progression: 'Aim to feel the stretch migrate deeper and higher in the hip over weeks. ROM is the progression.' },
      { name: 'Thoracic Rotation (Half-Kneeling)', sets: 3, reps: '10/side', rest: '45 sec', muscles: 'Thoracic erectors, external rotators, serratus anterior', cue: 'Half-kneeling position. Hand behind head. Rotate through the upper back only — the lower back should not move. This directly improves bench press and barbell row mechanics.', progression: 'Increase rotation range over time. Add a light plate for gentle resistance.' },
    ],
    nutrition: 'Lower-demand session — adjust total calories slightly down from heavy training days. Maintain protein intake regardless of session intensity. Focus on anti-inflammatory foods: leafy greens, fatty fish, berries, olive oil. Magnesium before bed (300–400mg glycinate) improves sleep quality and overnight muscle repair.',
    rationale: 'Most intermediate programs skip this day and pay for it with overuse injuries. Core stability prevents injury, transfers force between upper and lower body, and improves performance on every compound lift. Hip flexor and thoracic mobility directly improve squat depth and pressing mechanics — two of the biggest bottlenecks for intermediate lifters who have been training without structured mobility work.',
  },
  'push-b': {
    label: 'Push Day B',
    focus: 'Chest · Shoulders · Triceps (Volume Focus)',
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 4, reps: '10–12', rest: '2 min', muscles: 'Pectoralis major, anterior deltoid, triceps brachii', cue: 'Greater ROM than barbell. Touch the chest at the bottom without losing pec tension. Dumbbells travel in a slight arc inward at the top — do not press straight up.', progression: 'Add 2.5 lb per side when all 4 sets hit 12 reps with control.' },
      { name: 'Cable Chest Fly (Mid Cable)', sets: 3, reps: '15', rest: '90 sec', muscles: 'Pectoralis major (sternal head), anterior deltoid', cue: 'Slight forward lean. Arms slightly bent throughout. Squeeze the pecs at the center — imagine hugging a barrel. Never use momentum. This is a stretch-and-contract movement.', progression: 'Add 5 lb when 3 sets hit 15 reps with a controlled peak squeeze.' },
      { name: 'Arnold Press', sets: 3, reps: '10–12', rest: '2 min', muscles: 'All three deltoid heads, triceps brachii', cue: 'Start with palms facing you at chin height. Rotate to palms forward as you press overhead. The rotation recruits all three deltoid heads through the range of motion.', progression: 'Add 2.5 lb per side when 3 sets hit 12 reps.' },
      { name: 'Machine Lateral Raise', sets: 3, reps: '15', rest: '90 sec', muscles: 'Lateral deltoid', cue: 'Elbow contacts the pad, not the wrist. This removes forearm leverage and isolates the lateral head better than dumbbell variations where the forearm assists.', progression: 'Add the minimum available increment when all sets hit 15 reps cleanly.' },
      { name: 'Skull Crushers (EZ Bar)', sets: 3, reps: '10–12', rest: '90 sec', muscles: 'Triceps brachii (long and medial head)', cue: 'Lower bar to forehead or just behind the head. Elbows travel slightly backward as the bar descends. Press by driving elbows forward and up — not just extending straight.', progression: 'Add 2.5–5 lb when 3 sets hit 12 reps.' },
      { name: 'Tricep Dip (Bench or Bar)', sets: 3, reps: '12–15', rest: '90 sec', muscles: 'Triceps brachii, anterior deltoid, pectoralis minor', cue: 'Stay upright for tricep emphasis. Lean forward to shift work to the chest. Lower until elbows hit 90°. Press through palms evenly.', progression: 'Add weight via dip belt once bodyweight 15 reps are controlled for all 3 sets.' },
    ],
    nutrition: 'Push Day B uses higher rep ranges — lactic acid accumulates significantly. Stay well hydrated through the session. If you are in a surplus (building phase), maintain the surplus today. If cutting, protein is the non-negotiable — everything else can flex, protein cannot. Target 40g+ protein post-session regardless of goal.',
    rationale: "Push B prioritizes volume over intensity. Dumbbells replace the barbell for increased unilateral range of motion and freedom of movement. Arnold Press rotates through more of the shoulder's functional range than a standard press, improving strength across a wider arc. Higher rep isolation work on Push B creates the hypertrophic volume the heavier Push A does not fully deliver.",
  },
  'pull-b': {
    label: 'Pull Day B',
    focus: 'Back · Biceps (Strength + Stretch)',
    exercises: [
      { name: 'Conventional Deadlift', sets: 3, reps: '4–5', rest: '4 min', muscles: 'Hamstrings, gluteus maximus, erector spinae, trapezius, lats, forearms', cue: 'Bar over mid-foot. Grip just outside legs. Hips above knees, shoulders above hips. Drive the floor away — do not think of it as a pull. Lock hips and knees out simultaneously at the top.', progression: 'Add 5 lb when all 3 sets hit 5 reps with solid bracing and no rounding. The deadlift is a slow-progress movement — respect the increments.' },
      { name: 'Pull-Up or Assisted Pull-Up', sets: 4, reps: '6–10', rest: '2–3 min', muscles: 'Latissimus dorsi, teres major, biceps brachii, rear deltoid', cue: 'Full hang at the bottom. Pull elbows to hips, not bar to chin. Initiate by depressing and retracting scapulae before bending elbows — this is the difference between a shoulder exercise and a back exercise.', progression: 'Bodyweight: add reps, then add load via belt once 4x10. Assisted: reduce assistance by one increment each week.' },
      { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '12/side', rest: '90 sec', muscles: 'Latissimus dorsi, rhomboids, biceps brachii', cue: 'Brace on bench with free hand. Let the dumbbell hang fully to stretch the lat at the bottom. Pull to hip, not to chest. Allow slight torso rotation for full ROM — this is not cheating, it is mechanics.', progression: 'Add 2.5–5 lb when all reps are controlled on both sides.' },
      { name: 'Rear Delt Fly (Machine or Incline DB)', sets: 4, reps: '15', rest: '90 sec', muscles: 'Posterior deltoid, infraspinatus, teres minor', cue: 'Lead with elbows, not hands. Stop at shoulder height. Do not shrug — trap involvement steals the stimulus from the rear delt. Small weight, deliberate contraction.', progression: 'A 2.5 lb jump is significant here. Rear delts fatigue quickly and respond to quality, not load.' },
      { name: 'Incline Dumbbell Curl', sets: 3, reps: '12', rest: '90 sec', muscles: 'Biceps brachii long head, brachialis', cue: 'Sit back on an incline bench. Arms hang behind the body — this stretches the long head of the bicep in a way no other curl can. Curl without shoulder movement.', progression: 'Add 2.5 lb per side when 3 sets hit 12 reps.' },
      { name: 'Cable Curl (Straight Bar)', sets: 3, reps: '15', rest: '75 sec', muscles: 'Biceps brachii, brachialis, brachioradialis', cue: 'Constant cable tension keeps biceps under load through the entire range — unlike free weights that reduce tension at peak. Supinate at the top. Control the negative.', progression: 'Add 5 lb when 3 sets hit 15 reps with a full squeeze at the top.' },
    ],
    nutrition: 'The deadlift taxes the entire posterior chain and CNS. After a heavy pull session, eat a full post-workout meal within 60 minutes — do not skip it. Casein protein before bed (cottage cheese, Greek yogurt) promotes overnight muscle protein synthesis during the extended repair window. Do not undereat on pull days.',
    rationale: 'Pull B leads with the deadlift for maximum posterior chain strength — once per week is sufficient given its systemic recovery demand. Pull-ups provide vertical pulling in a more challenging context than lat pulldowns and build grip strength simultaneously. Incline curls uniquely lengthen the long head of the bicep under load, producing a greater hypertrophic stimulus than standard curl variations at equivalent volume.',
  },
  'legs-b': {
    label: 'Legs Day B',
    focus: 'Quads · Glutes · Hamstrings (Accessory Focus)',
    exercises: [
      { name: 'Hack Squat or Front Squat', sets: 4, reps: '8–10', rest: '3 min', muscles: 'Quadriceps (vastus lateralis, vastus medialis), gluteus maximus', cue: 'Hack squat: heels elevated, feet shoulder-width. Front squat: bar in rack position, elbows high — if elbows drop, the bar drops. Both variations shift load to the quads versus back squat.', progression: 'Add 5–10 lb when all 4 sets hit 10 reps. Front squat: add 5 lb only.' },
      { name: 'Hip Thrust (Barbell)', sets: 4, reps: '10–12', rest: '2 min', muscles: 'Gluteus maximus, gluteus medius, hamstrings', cue: 'Upper back on bench. Bar padded over the hip crease. Feet flat and close to hips. Drive hips up — squeeze glutes at the top and hold for 1 second. Do not hyperextend the spine at the top.', progression: 'Add 10 lb when all 4 sets hit 12 strong, controlled reps.' },
      { name: 'Walking Lunge (Dumbbell)', sets: 3, reps: '12/leg', rest: '2 min', muscles: 'Quadriceps, gluteus maximus, hamstrings, hip stabilizers', cue: 'Long step. Drop the rear knee toward the floor without touching. Front shin should stay vertical. Expect more systemic fatigue than equivalent bilateral exercises — single-leg work exposes strength imbalances.', progression: 'Add 2.5–5 lb per side when 3 sets complete without form breakdown.' },
      { name: 'Leg Extension (Machine)', sets: 3, reps: '15', rest: '90 sec', muscles: 'Quadriceps (all four heads, rectus femoris emphasis)', cue: 'Sit fully back in the seat. Point toes slightly inward for more VMO (inner quad) activation. Full extension at the top — hold for 1 second. Lower slowly.', progression: 'Add 5 lb when 3 sets hit 15 reps with full extension and a 1-second hold.' },
      { name: 'Seated Leg Curl (Machine)', sets: 3, reps: '12–15', rest: '90 sec', muscles: 'Hamstrings (biceps femoris, semimembranosus)', cue: 'Seated position places hamstrings in a lengthened position from the hip — greater stretch stimulus than lying leg curl. Full range of motion. Control the eccentric on every rep.', progression: 'Add 5 lb when all sets hit 15 reps.' },
      { name: 'Seated Calf Raise', sets: 4, reps: '15–20', rest: '60 sec', muscles: 'Soleus (primary), gastrocnemius', cue: 'Seated targets the soleus — the deeper calf muscle, often underdeveloped relative to the gastrocnemius. Full ROM: full stretch at the bottom, full contraction at the top. No partial reps.', progression: 'Add 5–10 lb when 4 sets hit 20 reps with full ROM.' },
    ],
    nutrition: 'Legs B has slightly lower CNS demand than Legs A but still requires caloric support. Hip thrusts target the glutes directly — leucine-rich protein sources (eggs, beef, whey) are the most effective trigger for muscle protein synthesis in the glutes. Consider a pre-workout carb source: 30–50g consumed 30–60 minutes before training.',
    rationale: 'Legs B shifts the emphasis forward: quad-dominant squatting and hip thrusts as the primary glute stimulus. This directly balances the posterior emphasis of Legs A and ensures neither quad nor posterior chain development falls behind. Walking lunges train single-leg stability — a critical capacity for preventing asymmetrical strength imbalances that compound over months of bilateral-only training.',
  },
  'recovery': {
    label: 'Active Recovery',
    focus: 'Cardio · Mobility · Blood Flow',
    exercises: [
      { name: 'Steady-State Cardio', sets: 1, reps: '30–40 min', rest: 'None', muscles: 'Cardiovascular system, aerobic energy system', cue: 'Keep heart rate at 50–65% of max HR (roughly: 220 minus your age, multiplied by 0.6). Options: walking, cycling, rowing, swimming. You should be able to hold a full conversation. This is recovery work, not training.', progression: 'Increase duration before intensity. 40–45 min at Zone 2 is the ceiling for this session type.' },
      { name: 'Cat-Cow (Spinal Mobility)', sets: 3, reps: '10 slow reps', rest: '30 sec', muscles: 'Spinal extensors, multifidus, rectus abdominis', cue: 'On hands and knees. Arch fully (cow), then round fully (cat). Move vertebra by vertebra. Inhale on cow, exhale on cat. Do not rush — the slow movement is the mechanism.', progression: 'Increase the range of motion at each end of the movement over weeks.' },
      { name: "World's Greatest Stretch", sets: 2, reps: '5/side', rest: '30 sec', muscles: 'Hip flexors, glutes, thoracic spine, hamstrings', cue: 'From a lunge position: front foot flat. Same-side elbow to floor. Then rotate that arm toward the ceiling. Hold each position 2–3 seconds. This one stretch addresses five mobility restrictions at once.', progression: 'Aim for deeper range at each position over time.' },
      { name: 'Foam Roll: Thoracic Spine', sets: 1, reps: '90 sec', rest: 'None', muscles: 'Thoracic erectors, rhomboids', cue: "Roll slowly from T1 to T12. When you hit a tender spot, stop and breathe into it for 3–5 breaths before moving on. Don't roll the lower back — the lumbar spine does not benefit from this.", progression: 'Soreness at specific spots should decrease week over week — it means adaptation is happening.' },
      { name: 'Foam Roll: Lats and IT Band', sets: 1, reps: '60 sec/side', rest: 'None', muscles: 'Latissimus dorsi, iliotibial band, tensor fasciae latae', cue: 'Lat: arm overhead, roll from armpit to just above hip. IT band: side-lying, roll from hip to just above knee. Slow passes are more effective than fast rolling — you are not a rolling pin.', progression: 'Decreased soreness over weeks indicates adaptation. Move to less-addressed areas.' },
      { name: 'Band Pull-Apart', sets: 3, reps: '20', rest: '45 sec', muscles: 'Rear deltoid, middle trapezius, rhomboids', cue: 'Arms parallel to floor, palms down. Pull band apart until fully extended. Control the return. Keep arms straight throughout. This maintains posterior chain health between Pull Day sessions.', progression: 'Use a thicker band when 3 sets of 20 feel easy with full extension.' },
    ],
    nutrition: 'Recovery days are not rest days from nutrition. Keep protein intake consistent with training days — muscle repair continues 24–48 hours post-session. Reduce total calories by 10–15% since metabolic demand is lower. Prioritize sleep quality (7–9 hours), hydration (body weight in lbs divided by 2 equals target oz of water), and anti-inflammatory foods.',
    rationale: 'Active recovery accelerates the clearance of metabolic waste from training sessions and stimulates blood flow without adding muscle damage. Zone 2 cardio builds mitochondrial density and aerobic base capacity — adaptations that improve all other training. Mobility work is more effective on recovery days than training days because the body is not competing for resources between performance and adaptation.',
  },
}

// ─── Beginner Program (3 days/week full body) ─────────────────────────────────

const WORKOUTS_BEGINNER = {
  'full-a': {
    label: 'Full Body A',
    focus: 'Squat · Press · Row',
    exercises: [
      { name: 'Goblet Squat', sets: 3, reps: '10–12', rest: '2 min', muscles: 'Quadriceps, glutes, core', cue: 'Hold dumbbell at chest. Feet shoulder-width, toes slightly out. Squat until elbows touch knees. Keep chest tall throughout. Drive through heels to stand.', progression: 'Add 5 lb when 3 sets hit 12 reps with full depth and control.' },
      { name: 'Dumbbell Bench Press', sets: 3, reps: '10–12', rest: '90 sec', muscles: 'Chest, front deltoid, triceps', cue: 'Lie on bench, dumbbells at chest level. Press up and slightly inward. Lower with control — 2 seconds down. Keep shoulder blades pulled together throughout.', progression: 'Add 2.5 lb per side when 3 sets hit 12 reps.' },
      { name: 'Dumbbell Row', sets: 3, reps: '10–12/side', rest: '90 sec', muscles: 'Lats, rhomboids, biceps', cue: 'Brace one hand on bench. Let dumbbell hang fully at bottom. Pull to hip, not to shoulder. Keep back flat. Control the return.', progression: 'Add 5 lb when all sets hit 12 reps on both sides.' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10–12', rest: '90 sec', muscles: 'Deltoids, triceps', cue: 'Sit upright. Start at ear height. Press straight up without arching lower back. Lower slowly to starting position. Brace core throughout.', progression: 'Add 2.5 lb per side when 3 sets hit 12 reps.' },
      { name: 'Plank', sets: 3, reps: '30 sec', rest: '60 sec', muscles: 'Core, glutes, shoulders', cue: 'Forearms on floor, body in a straight line from head to heels. Squeeze glutes. Do not let hips sag or rise. Breathe steadily throughout.', progression: 'Increase to 45 seconds, then 60 seconds per set.' },
    ],
    nutrition: 'Fuel your full body session with 30–50g protein and 40–60g carbs within 2 hours. Beginners respond well to consistent protein intake — aim for 0.7g per lb of bodyweight daily. Hydration matters more than most people think — drink water throughout the day, not just during training.',
    rationale: 'Full body sessions train each muscle group three times per week, maximizing the neurological learning phase for beginners. Compound movements first while energy is highest. Core work at the end when stabilizers are already warmed up.',
  },
  'full-b': {
    label: 'Full Body B',
    focus: 'Hinge · Pull · Push',
    exercises: [
      { name: 'Romanian Deadlift (Dumbbell)', sets: 3, reps: '10–12', rest: '2 min', muscles: 'Hamstrings, glutes, lower back', cue: 'Hold dumbbells in front of thighs. Hinge at hips, pushing them back. Lower weights down legs until you feel a hamstring stretch. Drive hips forward to return. Keep back flat throughout.', progression: 'Add 5 lb when 3 sets hit 12 reps with a controlled eccentric.' },
      { name: 'Lat Pulldown', sets: 3, reps: '10–12', rest: '90 sec', muscles: 'Lats, biceps', cue: 'Grip bar slightly wider than shoulders. Pull bar to upper chest. Lean back slightly. Lead with elbows, not hands. Control the return — do not let the weight snap up.', progression: 'Add 5–10 lb when 3 sets hit 12 smooth reps.' },
      { name: 'Dumbbell Incline Press', sets: 3, reps: '10–12', rest: '90 sec', muscles: 'Upper chest, front deltoid, triceps', cue: 'Set bench to 30–45°. Press dumbbells up and slightly inward. Elbows at 45° to your torso — not flared out. Lower with control to chest level.', progression: 'Add 2.5 lb per side when 3 sets hit 12 reps.' },
      { name: 'Dumbbell Lateral Raise', sets: 3, reps: '12–15', rest: '60 sec', muscles: 'Lateral deltoid', cue: 'Stand upright. Lead with elbows. Raise to shoulder height — no higher. Lower slowly. Do not swing the torso or use momentum.', progression: 'Add 2.5 lb when 3 sets hit 15 reps with control.' },
      { name: 'Dumbbell Bicep Curl', sets: 3, reps: '12–15', rest: '60 sec', muscles: 'Biceps', cue: 'Keep elbows pinned to sides. Curl with a supinated grip. Lower slowly — 2 seconds on the way down. Do not swing your shoulders to help the weight up.', progression: 'Add 2.5 lb per side when 3 sets hit 15 reps.' },
    ],
    nutrition: 'Full Body B is slightly less demanding than A — still prioritize protein at every meal. Beginners often undereat protein without realizing it. Track for one week to get a baseline, then adjust. Consistency in nutrition matters more than perfect timing.',
    rationale: 'Full Body B rotates the emphasis to the posterior chain (hamstrings, lats) to complement Full Body A. Alternating between A and B across three sessions per week ensures balanced development and prevents overuse patterns.',
  },
  'rest': {
    label: 'Rest & Recovery',
    focus: 'Mobility · Light Activity',
    exercises: [
      { name: 'Walking', sets: 1, reps: '20–30 min', rest: 'None', muscles: 'Cardiovascular system, legs', cue: 'Easy pace. Should feel comfortable — you should be able to hold a conversation. This is active recovery, not cardio training. The goal is blood flow, not fatigue.', progression: 'Increase duration gradually if you enjoy it. Consistency matters more than intensity.' },
      { name: 'Cat-Cow Stretch', sets: 2, reps: '10 slow reps', rest: '30 sec', muscles: 'Spine, core', cue: 'On hands and knees. Arch fully, then round fully. Move slowly and breathe. Inhale on the arch, exhale on the round. This loosens the spine and improves posture.', progression: 'Focus on increasing range of motion over time.' },
      { name: 'Hip Flexor Stretch', sets: 2, reps: '45 sec/side', rest: '30 sec', muscles: 'Hip flexors, quads', cue: 'Kneel on one knee. Push hips forward gently. Keep torso upright. You should feel a stretch at the front of the hip, not in the lower back. Hold steady — do not bounce.', progression: 'Deeper stretch as flexibility improves over weeks.' },
      { name: 'Shoulder Rolls and Neck Mobility', sets: 2, reps: '10 reps', rest: '30 sec', muscles: 'Shoulders, neck, upper back', cue: 'Slow, controlled shoulder circles forward and back. Gentle neck tilts side to side. Never force range of motion. These are mobility drills, not stretches.', progression: 'Increased range of motion and reduced stiffness over weeks.' },
    ],
    nutrition: 'Rest days are when your muscles actually grow — the workout is just the signal. Protein intake on rest days is just as important as on training days. Reduce total calories slightly (10–15%) since energy expenditure is lower, but keep protein the same.',
    rationale: 'Beginners need more recovery between sessions than experienced lifters because the neurological and structural adaptations are more demanding. Active recovery on rest days improves blood flow without adding training stress.',
  },
}

// ─── Advanced Program (6 days/week PPL high volume) ──────────────────────────

const WORKOUTS_ADVANCED = {
  'push-a': {
    label: 'Push Day A — Strength',
    focus: 'Chest · Shoulders · Triceps (Heavy)',
    exercises: [
      { name: 'Barbell Bench Press', sets: 5, reps: '3–5', rest: '4 min', muscles: 'Pectoralis major, anterior deltoid, triceps brachii', cue: 'Retract and depress scapulae hard. Arch your upper back slightly. Drive through your legs. Bar path should be a slight arc — not straight up. Pause 1 second on chest on heaviest sets.', progression: 'Add 5 lb when all 5 sets hit 5 reps. Use percentage-based loading — work at 80–87% of 1RM.' },
      { name: 'Incline Barbell Press', sets: 4, reps: '6–8', rest: '3 min', muscles: 'Upper pectoralis major, anterior deltoid', cue: '30° bench angle. Grip slightly narrower than flat bench. Lower to upper chest. Press in a slight arc inward. Heavier than dumbbell variation — prioritize controlled descent.', progression: 'Add 5 lb when 4 sets hit 8 reps. Deload if upper chest soreness becomes persistent.' },
      { name: 'Dumbbell Shoulder Press', sets: 4, reps: '8–10', rest: '2 min', muscles: 'All three deltoid heads, triceps', cue: 'Neutral grip or pronated. Press from ear height. Full lockout at top. Lower slowly — 3 seconds down. Avoid lumbar hyperextension by bracing hard.', progression: 'Add 2.5 lb per side when 4 sets hit 10 reps.' },
      { name: 'Cable Lateral Raise', sets: 4, reps: '15', rest: '75 sec', muscles: 'Lateral deltoid', cue: 'Cross-body cable for constant tension. Lead with elbow. Pause at shoulder height. Lower with full control — 3 seconds. No momentum at any point.', progression: 'Add 2.5 lb when 4 sets hit 15 controlled reps.' },
      { name: 'Skull Crushers', sets: 4, reps: '10–12', rest: '90 sec', muscles: 'Triceps brachii long and medial head', cue: 'Lower bar to forehead or just behind. Elbows travel slightly back as bar descends. Drive elbows forward and up on the press. Keep upper arms perpendicular to floor throughout.', progression: 'Add 2.5–5 lb when 4 sets hit 12 reps.' },
      { name: 'Rope Tricep Pushdown', sets: 3, reps: '15', rest: '60 sec', muscles: 'Triceps brachii', cue: 'Split rope at bottom. Elbows pinned to sides. Full extension on every rep. Control the return — do not let elbows flare. Finisher — pump focused.', progression: 'Add 5 lb when 3 sets hit 15 reps easily.' },
    ],
    nutrition: 'Heavy push day — highest CNS demand of the week. Eat a full carb meal 2 hours before. Post-session: 50g protein and 80g fast carbs within 45 minutes. Do not train fasted on heavy press days — performance drop is significant and not worth the calorie deficit.',
    rationale: 'Push A leads with maximum strength work on the bench press at 80–87% 1RM. This builds the neural drive and strength base that supports all hypertrophy work. Volume is distributed across compound and isolation movements after the heavy work is complete.',
  },
  'pull-a': {
    label: 'Pull Day A — Strength',
    focus: 'Back · Biceps (Heavy)',
    exercises: [
      { name: 'Conventional Deadlift', sets: 4, reps: '3–5', rest: '4–5 min', muscles: 'Entire posterior chain, traps, lats, forearms', cue: 'Bar over mid-foot. Hips above knees. Shoulders above hips. Brace 360° before pulling. Drive the floor away. Lock out hips and knees simultaneously. Do not hyperextend at top.', progression: 'Add 5–10 lb when 4 sets hit 5 reps. Deadlift progresses slowly at advanced level — respect the increments.' },
      { name: 'Weighted Pull-Up', sets: 4, reps: '5–8', rest: '3 min', muscles: 'Latissimus dorsi, teres major, biceps, rear deltoid', cue: 'Use a dip belt or hold dumbbell between feet. Full hang at bottom. Pull elbows to hips. Initiate with scapular depression before bending elbows. Controlled descent — 3 seconds.', progression: 'Add 2.5–5 lb when 4 sets hit 8 reps. Never sacrifice ROM for load.' },
      { name: 'Barbell Row (Pendlay)', sets: 4, reps: '6–8', rest: '3 min', muscles: 'Lats, rhomboids, traps, biceps', cue: 'Bar starts on floor each rep. Torso parallel to floor. Explosive pull to lower chest. Bar touches floor between reps — this eliminates momentum from the hip. Full dead stop each rep.', progression: 'Add 5 lb when 4 sets hit 8 reps.' },
      { name: 'Face Pull (Rope)', sets: 4, reps: '15–20', rest: '75 sec', muscles: 'Rear deltoid, external rotators, mid traps', cue: 'External rotation at the top is mandatory. Pull to forehead, not chin. Pause at peak and hold for 1 second. This is shoulder health maintenance — never skip it on pull days.', progression: 'Keep load conservative. Quality of external rotation matters more than weight.' },
      { name: 'Incline Dumbbell Curl', sets: 4, reps: '10–12', rest: '90 sec', muscles: 'Biceps long head, brachialis', cue: 'Full hang at bottom for maximum stretch. Curl without shoulder movement. Supinate at the top. Lower slowly — 3 seconds eccentric. One of the best bicep builders available.', progression: 'Add 2.5 lb per side when 4 sets hit 12 reps.' },
      { name: 'Hammer Curl', sets: 3, reps: '12–15', rest: '75 sec', muscles: 'Brachialis, brachioradialis, biceps', cue: 'Neutral grip throughout. No wrist rotation. Elbows pinned to sides. Alternate arms. The brachialis pushes the bicep up when developed — do not neglect this.', progression: 'Add 2.5 lb per side when 3 sets hit 15 controlled reps.' },
    ],
    nutrition: 'Deadlift day is the highest caloric demand session of the week. Do not train in a significant deficit today. Post-session: full meal within 60 minutes. Casein protein before bed to support the extended overnight repair window after heavy pulling.',
    rationale: 'Pull A leads with the deadlift at maximum strength intensity. Weighted pull-ups follow for vertical pulling strength. Pendlay rows add horizontal pulling power. Accessory work addresses the rear delts and biceps — critical for shoulder health and arm development at advanced levels.',
  },
  'legs-a': {
    label: 'Legs Day A — Strength',
    focus: 'Quads · Posterior Chain (Heavy)',
    exercises: [
      { name: 'Barbell Back Squat', sets: 5, reps: '3–5', rest: '4–5 min', muscles: 'Quadriceps, glutes, hamstrings, core, erectors', cue: 'High bar or low bar — pick one and be consistent. Brace 360° before descent. Sit between heels. Break parallel every rep. Drive knees out hard on ascent. Belt optional but beneficial at heavy loads.', progression: 'Add 5 lb when 5 sets hit 5 reps. Squat progress is slow at advanced level — microplates are essential.' },
      { name: 'Romanian Deadlift', sets: 4, reps: '8–10', rest: '3 min', muscles: 'Hamstrings, glutes, erectors', cue: 'Load heavier than intermediate version. Maintain controlled 3-second eccentric. Bar stays close to legs. Feel stretch in hamstrings at bottom — pause 1 second. Drive hips forward on ascent.', progression: 'Add 5–10 lb when 4 sets hit 10 reps with full eccentric control.' },
      { name: 'Leg Press', sets: 4, reps: '10–12', rest: '2 min', muscles: 'Quadriceps, glutes', cue: 'High volume accessory work after heavy squats. Full ROM — knees to 90°. Do not lock out. Control the descent. Foot placement determines emphasis — experiment to find what works for your anatomy.', progression: 'Add 20 lb per side when 4 sets hit 12 reps.' },
      { name: 'Leg Curl (Lying)', sets: 4, reps: '12–15', rest: '90 sec', muscles: 'Hamstrings', cue: 'Plantarflex to maximize hamstring shortening. Full ROM. Pause at peak contraction — do not let the stack bounce. Control the eccentric on every rep.', progression: 'Add 5 lb when 4 sets hit 15 clean reps.' },
      { name: 'Standing Calf Raise', sets: 5, reps: '15–20', rest: '60 sec', muscles: 'Gastrocnemius', cue: 'Full stretch at the bottom — pause 1 full second. Full contraction at the top — pause 1 full second. Calves require full ROM to respond. Partial reps are wasted effort at any level.', progression: 'Add 10 lb when 5 sets hit 20 reps with full pauses.' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: '10/leg', rest: '2 min', muscles: 'Quads, glutes, hip stabilizers', cue: 'Rear foot elevated on bench. Front foot forward enough that shin stays vertical. Lower until rear knee nearly touches floor. Drive through front heel. Expect significant difficulty — this is normal.', progression: 'Add 5 lb per side when 3 sets hit 10 reps on both legs.' },
    ],
    nutrition: 'Heavy squat day demands the most from your body. Increase carbohydrates by 20–30% today. Pre-session: slow carbs 2 hours before. Post-session: fast carbs and protein within 45 minutes. Do not train legs heavy in a significant calorie deficit — performance and safety both suffer.',
    rationale: 'Legs A prioritizes maximum strength in the squat with 5 sets of heavy triples to fives. Volume follows in Romanian deadlifts and leg press. Bulgarian split squats address unilateral strength imbalances that bilateral training cannot reveal.',
  },
  'push-b': {
    label: 'Push Day B — Volume',
    focus: 'Chest · Shoulders · Triceps (Hypertrophy)',
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 4, reps: '10–12', rest: '2 min', muscles: 'Pectoralis major, anterior deltoid, triceps', cue: 'Greater ROM than barbell. Touch chest at bottom without losing pec tension. Press in a slight arc inward at top. This session is volume-focused — control matters more than load.', progression: 'Add 2.5 lb per side when 4 sets hit 12 reps with full control.' },
      { name: 'Cable Chest Fly (High to Low)', sets: 4, reps: '15', rest: '75 sec', muscles: 'Pectoralis major sternal head', cue: 'High cable attachment. Pull downward and inward in an arc. Arms slightly bent throughout. Squeeze pecs hard at bottom. Slow return — 3 seconds. Constant tension is the goal.', progression: 'Add 5 lb when 4 sets hit 15 reps with a controlled peak contraction.' },
      { name: 'Arnold Press', sets: 4, reps: '10–12', rest: '2 min', muscles: 'All three deltoid heads, triceps', cue: 'Start with palms facing you. Rotate as you press overhead. Recruits all three deltoid heads through the arc. Heavier than standard press — use conservative weight and focus on the rotation.', progression: 'Add 2.5 lb per side when 4 sets hit 12 reps.' },
      { name: 'Machine Lateral Raise', sets: 4, reps: '15–20', rest: '75 sec', muscles: 'Lateral deltoid', cue: 'Elbow on pad, not wrist. Higher rep range — feel the burn in the lateral head. Drop set on last set: strip 20% and keep going to failure. Lateral head responds well to high volume.', progression: 'Add minimum increment when 4 sets hit 20 reps cleanly.' },
      { name: 'Close-Grip Bench Press', sets: 4, reps: '8–10', rest: '2 min', muscles: 'Triceps, pectoralis minor, anterior deltoid', cue: 'Grip 16–18 inches wide. Keep elbows tucked to sides throughout. Lower to lower chest. Press straight up. More tricep-dominant than standard bench — prioritize tricep lockout.', progression: 'Add 5 lb when 4 sets hit 10 reps.' },
      { name: 'Overhead Tricep Extension (Cable)', sets: 3, reps: '15', rest: '60 sec', muscles: 'Triceps long head', cue: 'Face away from cable. Rope overhead. Extend from fully stretched position. Long head is most active in the stretched position — use full ROM. Finisher — keep weight manageable.', progression: 'Add 5 lb when 3 sets hit 15 reps comfortably.' },
    ],
    nutrition: 'Push B is volume-focused — total sets are high. Ensure adequate carbohydrate intake for glycogen availability throughout the session. Intra-workout carbs (banana, sports drink) can maintain performance in sessions exceeding 60 minutes.',
    rationale: 'Push B switches from strength to hypertrophy emphasis. Lower loads, higher reps, shorter rest. This creates the metabolic stress and volume stimulus that complements the neural drive built on Push A. The combination of both sessions produces superior results to either approach alone.',
  },
  'pull-b': {
    label: 'Pull Day B — Volume',
    focus: 'Back · Biceps (Hypertrophy)',
    exercises: [
      { name: 'Pull-Up (Bodyweight)', sets: 4, reps: '8–12', rest: '2 min', muscles: 'Lats, teres major, biceps, rear deltoid', cue: 'No added weight — bodyweight only for volume day. Full hang at bottom. Controlled ascent and descent. If 12 reps become easy, add load on Pull A day instead of here.', progression: 'Increase reps until 4x12 is comfortable, then add load on Pull A.' },
      { name: 'Single-Arm Cable Row', sets: 4, reps: '12–15/side', rest: '90 sec', muscles: 'Lats, rhomboids, biceps', cue: 'Full stretch at bottom — lat under load. Pull to hip. Allow slight torso rotation for full ROM. Pause and squeeze at peak. Single arm allows greater ROM than bilateral rows.', progression: 'Add 5 lb when 4 sets hit 15 reps on both sides.' },
      { name: 'Lat Pulldown (Underhand)', sets: 4, reps: '10–12', rest: '90 sec', muscles: 'Latissimus dorsi, biceps', cue: 'Supinated grip shoulder-width. Pull to upper chest. Slight lean back. Lead with elbows — think about driving them toward your hips, not pulling the bar. Full stretch at top.', progression: 'Add 5–10 lb when 4 sets hit 12 reps.' },
      { name: 'Rear Delt Fly (Cable)', sets: 4, reps: '15–20', rest: '75 sec', muscles: 'Posterior deltoid, infraspinatus', cue: 'Cross-cable setup or pec deck in reverse. Lead with elbows. Stop at shoulder height. Do not shrug. High rep, controlled — rear delts respond to quality more than load.', progression: 'Add 2.5 lb when 4 sets hit 20 clean reps.' },
      { name: 'EZ Bar Curl', sets: 4, reps: '10–12', rest: '90 sec', muscles: 'Biceps brachii, brachialis', cue: 'Strict form — no body swing. Full ROM. Supinate at top. Lower with 3-second eccentric. The eccentric is where most bicep growth happens. Do not cut it short.', progression: 'Add 2.5–5 lb when 4 sets hit 12 reps.' },
      { name: 'Cable Curl (High Cable)', sets: 3, reps: '15/side', rest: '60 sec', muscles: 'Biceps peak, brachialis', cue: 'Arms out to sides, cables at head height. Curl toward temples. The stretched position with arms out loads the long head maximally — this builds bicep peak. Control the return.', progression: 'Add 2.5 lb when 3 sets hit 15 reps with full control.' },
    ],
    nutrition: 'Pull B is volume and pump focused. Staying hydrated is critical — back and bicep volume is high and muscle pumps are significant. Post-session leucine-rich protein sources (whey, eggs) maximize muscle protein synthesis in the lats and biceps.',
    rationale: 'Pull B shifts emphasis from strength to hypertrophy. Higher reps, more total sets, shorter rest. The combination of Pull A and Pull B across the week delivers both strength and size stimulus to the back and biceps — a dual approach that produces superior development to either protocol alone.',
  },
  'legs-b': {
    label: 'Legs Day B — Volume',
    focus: 'Quads · Glutes (Hypertrophy)',
    exercises: [
      { name: 'Hack Squat', sets: 4, reps: '10–12', rest: '3 min', muscles: 'Quadriceps, glutes', cue: 'Heels elevated on platform if available. Feet shoulder-width. Descend until hips below parallel. Drive knees out throughout. More quad-dominant than back squat — feel the quads working.', progression: 'Add 10–20 lb when 4 sets hit 12 reps with full depth.' },
      { name: 'Hip Thrust (Barbell)', sets: 4, reps: '12–15', rest: '2 min', muscles: 'Gluteus maximus, gluteus medius, hamstrings', cue: 'Upper back on bench at shoulder blade height. Bar padded over hip crease. Drive hips to full extension — squeeze glutes hard at top and hold 1 second. Do not hyperextend spine.', progression: 'Add 10 lb when 4 sets hit 15 strong reps.' },
      { name: 'Walking Lunge (Dumbbell)', sets: 4, reps: '12/leg', rest: '2 min', muscles: 'Quads, glutes, hamstrings, hip stabilizers', cue: 'Long step. Drop rear knee toward floor. Front shin vertical. Drive through front heel. Single-leg work reveals and addresses strength imbalances between sides.', progression: 'Add 5 lb per side when 4 sets complete without form breakdown.' },
      { name: 'Leg Extension', sets: 4, reps: '15–20', rest: '90 sec', muscles: 'Quadriceps all four heads', cue: 'Full extension — hold 1 second at top. Lower slowly — 3 seconds. High rep range on this session. Drop set on final set: strip 25% and continue to failure. Quad isolation with constant tension.', progression: 'Add 5 lb when 4 sets hit 20 reps with full extension and hold.' },
      { name: 'Seated Leg Curl', sets: 4, reps: '12–15', rest: '90 sec', muscles: 'Hamstrings', cue: 'Seated curl places hamstrings in a lengthened position from the hip. Greater stretch stimulus than lying variation. Full ROM. Control the eccentric — 3 seconds.', progression: 'Add 5 lb when 4 sets hit 15 reps.' },
      { name: 'Seated Calf Raise', sets: 5, reps: '15–20', rest: '60 sec', muscles: 'Soleus', cue: 'Seated targets the soleus — the deeper calf muscle. Full stretch at bottom with 1-second pause. Full contraction at top with 1-second hold. Five sets of calves — they need the volume.', progression: 'Add 10 lb when 5 sets hit 20 reps with full pauses.' },
    ],
    nutrition: 'Legs B focuses on glute and quad volume. Hip thrusts and hack squats are metabolically demanding — maintain carbohydrate intake. Post-session priority: protein and fast carbs within 45 minutes. Leucine-rich sources drive the strongest muscle protein synthesis response.',
    rationale: 'Legs B switches from maximum strength to hypertrophy volume. Hack squats and hip thrusts shift emphasis to quad and glute isolation. The combination of Legs A and B across the week delivers strength and size stimulus to every muscle of the lower body.',
  },
  'recovery': {
    label: 'Active Recovery',
    focus: 'Cardio · Mobility · Blood Flow',
    exercises: [
      { name: 'Steady-State Cardio', sets: 1, reps: '30–45 min', rest: 'None', muscles: 'Cardiovascular system', cue: 'Zone 2 — 60–70% max HR. Cycling, rowing, or walking preferred — lower impact on legs already taxed by heavy training. You should be able to hold a full conversation throughout.', progression: 'Increase duration before intensity. Advanced lifters benefit from consistent Zone 2 cardio for aerobic base and recovery capacity.' },
      { name: 'Foam Roll: Full Body', sets: 1, reps: '60 sec/area', rest: 'None', muscles: 'Lats, thoracic spine, IT band, quads, calves', cue: 'Spend extra time on areas that feel restricted. Slow passes. Stop on tender spots and breathe into them. Do not rush — thoroughness matters more than speed.', progression: 'Decreased soreness in specific areas over weeks indicates adaptation.' },
      { name: "World's Greatest Stretch", sets: 3, reps: '5/side', rest: '30 sec', muscles: 'Hip flexors, glutes, thoracic spine, hamstrings', cue: 'From lunge: elbow to floor, then rotate arm to ceiling. Hold each position 2–3 seconds. This addresses five mobility restrictions simultaneously — essential for advanced lifters with heavy training loads.', progression: 'Increased depth and range over weeks.' },
      { name: 'Hip 90/90 Stretch', sets: 3, reps: '60 sec/side', rest: '30 sec', muscles: 'Hip external and internal rotators, piriformis', cue: 'Sit with both legs at 90°. Sit tall — no rounding. Work each side. This directly improves squat depth and hip function. Essential maintenance for anyone squatting heavy.', progression: 'Increased ROM and comfort in the position over weeks.' },
      { name: 'Band Pull-Apart', sets: 3, reps: '25', rest: '45 sec', muscles: 'Rear deltoid, mid trapezius, rhomboids', cue: 'Arms parallel to floor. Pull fully apart. Control return. This counters the anterior dominance built through heavy pressing. Non-negotiable shoulder health work for advanced lifters.', progression: 'Thicker band when 3 sets of 25 feel easy.' },
    ],
    nutrition: 'Advanced lifters doing 6 sessions per week need to treat recovery day nutrition seriously. Keep protein consistent with training days. Reduce total calories 10–15%. Prioritize sleep — 8+ hours. Magnesium glycinate (300–400mg before bed) improves sleep quality and overnight recovery.',
    rationale: 'Six sessions per week creates significant cumulative fatigue. The recovery day is not optional — it is structural. Zone 2 cardio clears metabolic waste and builds aerobic base. Mobility work addresses the restrictions that accumulate under heavy training loads and prevents the overuse injuries that end advanced training careers.',
  },
}

// ─── Schedules ────────────────────────────────────────────────────────────────

const SCHEDULE_BEGINNER     = ['full-a', 'rest', 'full-b', 'rest', 'full-a', 'rest', 'rest']
const SCHEDULE_INTERMEDIATE = ['push-a', 'pull-a', 'legs-a', 'core', 'push-b', 'pull-b', 'legs-b', 'recovery', 'push-a', 'pull-a', 'legs-a', 'core', 'push-b', 'pull-b', 'legs-b', 'recovery', 'push-a', 'pull-a', 'legs-a', 'core', 'push-b', 'pull-b', 'legs-b', 'recovery', 'push-a', 'pull-a', 'legs-a', 'core', 'push-b', 'pull-b']
const SCHEDULE_ADVANCED     = ['push-a', 'pull-a', 'legs-a', 'push-b', 'pull-b', 'legs-b', 'recovery']

import SCHEDULE_JSON from './schedule.json'

export const SCHEDULE = SCHEDULE_JSON

export function getWorkouts(fitnessLevel) {
  if (fitnessLevel === 'Beginner') return { workouts: WORKOUTS_BEGINNER, schedule: SCHEDULE_BEGINNER }
  if (fitnessLevel === 'Advanced') return { workouts: WORKOUTS_ADVANCED, schedule: SCHEDULE_ADVANCED }
  return { workouts: WORKOUTS_INTERMEDIATE, schedule: SCHEDULE_INTERMEDIATE }
}

// Keep backward compatibility
export const WORKOUTS = WORKOUTS_INTERMEDIATE

export function getTodayIndex(joinedAt = null, seed = 0, fitnessLevel = 'Intermediate') {
  const { schedule } = getWorkouts(fitnessLevel)
  let dayIndex
  if (joinedAt) {
    const start = new Date(joinedAt)
    start.setHours(0, 0, 0, 0)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const diffMs = now - start
    dayIndex = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  } else {
    dayIndex = new Date().getDate() - 1
  }
  return (dayIndex + seed) % schedule.length
}

export function getWeekLabel(idx) {
  return 'Week ' + (Math.floor(idx / 7) + 1)
}
