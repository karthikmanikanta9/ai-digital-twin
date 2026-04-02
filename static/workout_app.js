// ================================================================
//  FitTwin – Workout App (with Condition-Personalized Plans)
//  Categories: fitness, respiratory, diabetes, obesity,
//              hypertension, heart, arthritis, stress, back,
//              pcos, thyroid, cholesterol
//  Personalization: fetches /api/workout_recommendations on load
// ================================================================

// ── CATEGORY CONFIG ─────────────────────────────────────────────
const CAT_META = {
    fitness:      { color: '#00f0ff', label: '🏃 Fitness' },
    respiratory:  { color: '#34d399', label: '🫁 Respiratory' },
    diabetes:     { color: '#f59e0b', label: '🩸 Diabetes' },
    obesity:      { color: '#f87171', label: '⚖️ Obesity' },
    hypertension: { color: '#818cf8', label: '🫀 Hypertension' },
    heart:        { color: '#fb7185', label: '❤️ Heart' },
    arthritis:    { color: '#a78bfa', label: '🦴 Arthritis' },
    stress:       { color: '#6ee7b7', label: '🌿 Stress' },
    back:         { color: '#fbbf24', label: '🦴 Back Pain' },
    pcos:         { color: '#f9a8d4', label: '🌸 PCOS' },
    thyroid:      { color: '#67e8f9', label: '🦋 Thyroid' },
    cholesterol:  { color: '#fde68a', label: '💛 Cholesterol' },
};

// ── FULL EXERCISE DATABASE ──────────────────────────────────────
const WORKOUTS = [

    // ── GENERAL FITNESS ────────────────────────────────────────
    { id: 'pushup',   category: 'fitness',
      conditions: ['fitness', 'general', 'strength'],
      emoji: '💪', title: 'Push-Ups',
      desc: 'Classic upper-body strength move. Builds chest, shoulders, and triceps. Improves core stability.',
      sets: '3 sets', reps: '15 reps', duration: 60, calories: 8,
      difficulty: 'Beginner', muscle: 'Chest · Shoulders · Triceps' },

    { id: 'squat',    category: 'fitness',
      conditions: ['fitness', 'obesity', 'diabetes'],
      emoji: '🦵', title: 'Bodyweight Squats',
      desc: 'Compound lower-body movement that activates quads, glutes, and core. Improves insulin sensitivity.',
      sets: '3 sets', reps: '20 reps', duration: 90, calories: 10,
      difficulty: 'Beginner', muscle: 'Quads · Glutes · Core' },

    { id: 'plank',    category: 'fitness',
      conditions: ['fitness', 'back', 'obesity'],
      emoji: '🧘', title: 'Plank Hold',
      desc: 'Isometric hold that builds deep core muscles, improves posture and reduces lower-back pain.',
      sets: '3 holds', reps: '45 seconds', duration: 45, calories: 5,
      difficulty: 'Beginner', muscle: 'Core · Back · Shoulders' },

    { id: 'lunges',   category: 'fitness',
      conditions: ['fitness', 'obesity', 'diabetes'],
      emoji: '🚶', title: 'Forward Lunges',
      desc: 'Unilateral movement correcting muscle imbalances. Strengthens legs and improves coordination.',
      sets: '3 sets', reps: '12 each leg', duration: 90, calories: 9,
      difficulty: 'Beginner', muscle: 'Quads · Glutes · Hamstrings' },

    { id: 'mountain', category: 'fitness',
      conditions: ['fitness', 'obesity', 'cholesterol'],
      emoji: '🏔️', title: 'Mountain Climbers',
      desc: 'Full-body cardio move raising heart rate while targeting core, shoulders, and hip flexors.',
      sets: '3 sets', reps: '30 seconds', duration: 30, calories: 7,
      difficulty: 'Intermediate', muscle: 'Core · Shoulders · Hip Flexors' },

    // ── RESPIRATORY ────────────────────────────────────────────
    { id: 'diaphragm', category: 'respiratory',
      conditions: ['respiratory', 'asthma', 'copd', 'stress'],
      emoji: '🫁', title: 'Diaphragmatic Breathing',
      desc: 'Slow belly-breathing strengthens the diaphragm, reduces breathlessness, improves lung capacity by 30%.',
      sets: '1 session', reps: '10 deep breaths', duration: 300, calories: 2,
      difficulty: 'Beginner', muscle: 'Diaphragm · Lungs' },

    { id: 'boxbreath', category: 'respiratory',
      conditions: ['respiratory', 'stress', 'anxiety', 'hypertension'],
      emoji: '📦', title: 'Box Breathing (4-4-4-4)',
      desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Reduces cortisol, improves O₂ exchange, calms the nervous system.',
      sets: '5 cycles', reps: '4 sec each phase', duration: 120, calories: 1,
      difficulty: 'Beginner', muscle: 'Lungs · Nervous System' },

    { id: 'pursedlip', category: 'respiratory',
      conditions: ['respiratory', 'asthma', 'copd'],
      emoji: '💨', title: 'Pursed Lip Breathing',
      desc: 'Exhale slowly through pursed lips. Keeps airways open longer, eases COPD & asthma symptoms significantly.',
      sets: '1 session', reps: '10 breaths', duration: 180, calories: 1,
      difficulty: 'Beginner', muscle: 'Bronchi · Airways' },

    { id: 'briskwalk', category: 'respiratory',
      conditions: ['respiratory', 'diabetes', 'obesity', 'cholesterol', 'hypertension'],
      emoji: '🚶‍♂️', title: 'Brisk Walking (30 min)',
      desc: 'Aerobic walk at 5–6 km/h. Improves lung capacity, strengthens heart, reduces inflammation.',
      sets: '1 session', reps: '30 minutes', duration: 1800, calories: 120,
      difficulty: 'Beginner', muscle: 'Cardiovascular · Lungs' },

    { id: 'kapalbhati', category: 'respiratory',
      conditions: ['respiratory', 'obesity', 'diabetes'],
      emoji: '🧘', title: 'Kapalbhati Pranayama',
      desc: 'Rapid belly-pumping yoga technique. Clears respiratory tract, strengthens abdominal muscles.',
      sets: '3 rounds', reps: '30 pumps each', duration: 180, calories: 5,
      difficulty: 'Intermediate', muscle: 'Diaphragm · Core · Lungs' },

    // ── DIABETES ───────────────────────────────────────────────
    { id: 'postmeal_walk', category: 'diabetes',
      conditions: ['diabetes', 'obesity', 'cholesterol'],
      emoji: '🏃', title: 'Post-Meal Walk',
      desc: 'A 15-min walk after eating lowers blood glucose by up to 22%. Muscles absorb glucose without insulin.',
      sets: '3x daily', reps: '15 minutes each', duration: 900, calories: 55,
      difficulty: 'Beginner', muscle: 'Full Body · Metabolism' },

    { id: 'resistance_band', category: 'diabetes',
      conditions: ['diabetes', 'obesity', 'pcos'],
      emoji: '🏋️', title: 'Resistance Band Training',
      desc: 'Muscle contraction during resistance training improves insulin sensitivity for 24–48 hours after exercise.',
      sets: '3 sets', reps: '15 reps', duration: 120, calories: 12,
      difficulty: 'Beginner', muscle: 'Arms · Legs · Back' },

    { id: 'hiit_mild', category: 'diabetes',
      conditions: ['diabetes', 'obesity', 'pcos', 'cholesterol'],
      emoji: '⚡', title: 'Mild HIIT Circuit',
      desc: '20s work / 40s rest: Jumping Jacks → High Knees → Rest. Shown to decrease HbA1c levels significantly.',
      sets: '4 rounds', reps: '20 sec work', duration: 240, calories: 35,
      difficulty: 'Intermediate', muscle: 'Full Body · Cardio' },

    { id: 'cycling', category: 'diabetes',
      conditions: ['diabetes', 'obesity', 'cholesterol', 'heart'],
      emoji: '🚴', title: 'Stationary Cycling',
      desc: 'Low-impact aerobic exercise improving glucose metabolism and cardiovascular health without joint stress.',
      sets: '1 session', reps: '20–30 minutes', duration: 1200, calories: 150,
      difficulty: 'Beginner', muscle: 'Quads · Cardio · Metabolism' },

    { id: 'yoga_diabetes', category: 'diabetes',
      conditions: ['diabetes', 'stress', 'pcos'],
      emoji: '🧘‍♀️', title: 'Yoga for Blood Sugar',
      desc: 'Surya Namaskar and Paschimottanasana stimulate the pancreas and improve insulin receptor sensitivity.',
      sets: '1 session', reps: '20 minutes', duration: 1200, calories: 60,
      difficulty: 'Beginner', muscle: 'Core · Pancreas · Flexibility' },

    // ── OBESITY ────────────────────────────────────────────────
    { id: 'jumping_jacks', category: 'obesity',
      conditions: ['obesity', 'cholesterol', 'diabetes'],
      emoji: '🙆', title: 'Jumping Jacks',
      desc: 'Full-body cardio that burns 8–10 kcal/min. Raises heart rate and boosts metabolism effectively.',
      sets: '3 sets', reps: '50 reps', duration: 90, calories: 15,
      difficulty: 'Beginner', muscle: 'Full Body · Cardio' },

    { id: 'burpees', category: 'obesity',
      conditions: ['obesity', 'fitness', 'cholesterol'],
      emoji: '🔥', title: 'Burpees',
      desc: 'High-intensity full-body exercise. Burns fat 50% faster than typical cardio with EPOC after-burn effect.',
      sets: '3 sets', reps: '10 reps', duration: 90, calories: 20,
      difficulty: 'Advanced', muscle: 'Full Body · Cardio · Core' },

    { id: 'stair_climb', category: 'obesity',
      conditions: ['obesity', 'heart', 'cholesterol'],
      emoji: '🪜', title: 'Stair Climbing',
      desc: 'Burns 2x more calories than flat walking. Targets glutes, quads, calves while improving cardio endurance.',
      sets: '5 rounds', reps: '2 floors each', duration: 300, calories: 40,
      difficulty: 'Beginner', muscle: 'Glutes · Quads · Cardio' },

    { id: 'skip_rope', category: 'obesity',
      conditions: ['obesity', 'fitness', 'diabetes'],
      emoji: '🪢', title: 'Jump Rope',
      desc: 'Burns 10–16 kcal/min — more than running! Improves coordination and cardiovascular health.',
      sets: '3 sets', reps: '60 seconds', duration: 60, calories: 12,
      difficulty: 'Intermediate', muscle: 'Full Body · Calves · Cardio' },

    { id: 'dance',    category: 'obesity',
      conditions: ['obesity', 'stress', 'fitness'],
      emoji: '💃', title: 'Dance / Zumba',
      desc: 'Fun high-energy cardio burning 350–650 kcal/hr. Reduces cortisol which drives belly fat storage.',
      sets: '1 session', reps: '20 minutes', duration: 1200, calories: 200,
      difficulty: 'Beginner', muscle: 'Full Body · Core · Cardio' },

    // ── HYPERTENSION ───────────────────────────────────────────
    { id: 'hyp_walk', category: 'hypertension',
      conditions: ['hypertension', 'heart', 'cholesterol'],
      emoji: '🚶‍♀️', title: 'Gentle Cardio Walk (BP)',
      desc: 'Gentle 30-min moderate walk significantly lowers systolic BP by 5–8 mmHg over 4 weeks. Do daily.',
      sets: '1 session', reps: '30 minutes', duration: 1800, calories: 100,
      difficulty: 'Beginner', muscle: 'Cardio · Legs · Heart' },

    { id: 'hyp_yoga', category: 'hypertension',
      conditions: ['hypertension', 'stress', 'heart'],
      emoji: '🧘', title: 'Yoga for Hypertension',
      desc: "Child's Pose, Shavasana, and Supine Twist activate the parasympathetic system, reducing cortisol and BP.",
      sets: '1 session', reps: '20 minutes', duration: 1200, calories: 40,
      difficulty: 'Beginner', muscle: 'Core · Nervous System · Flexibility' },

    { id: 'hyp_breath', category: 'hypertension',
      conditions: ['hypertension', 'respiratory', 'stress'],
      emoji: '🌬️', title: 'Slow Breathing Exercise (4-6)',
      desc: 'Inhale 4s, exhale 6s. This pattern activates the vagus nerve and can lower BP by up to 10 mmHg in 10 min.',
      sets: '3 rounds', reps: '10 breaths', duration: 180, calories: 2,
      difficulty: 'Beginner', muscle: 'Lungs · Vagus Nerve · Heart' },

    // ── HEART DISEASE ──────────────────────────────────────────
    { id: 'heart_walk', category: 'heart',
      conditions: ['heart', 'hypertension', 'cholesterol'],
      emoji: '❤️', title: 'Cardiac Walking',
      desc: 'Low-intensity walking at 3–4 km/h for 25 min. Strengthens the heart muscle without dangerous strain.',
      sets: '1 session', reps: '25 minutes', duration: 1500, calories: 80,
      difficulty: 'Beginner', muscle: 'Heart · Legs · Cardio' },

    { id: 'heart_yoga', category: 'heart',
      conditions: ['heart', 'stress', 'hypertension'],
      emoji: '💓', title: 'Chair Yoga (Heart-Safe)',
      desc: 'Seated yoga reduces blood pressure, improves heart rate variability, and reduces inflammation safely.',
      sets: '1 session', reps: '15 minutes', duration: 900, calories: 30,
      difficulty: 'Beginner', muscle: 'Flexibility · Stress Relief · Circulation' },

    { id: 'heart_stretch', category: 'heart',
      conditions: ['heart', 'fitness'],
      emoji: '🤸', title: 'Gentle Full-Body Stretch',
      desc: 'Full-body static stretching improves circulation, reduces arterial stiffness, and helps maintain flexibility.',
      sets: '1 session', reps: '15 minutes', duration: 900, calories: 20,
      difficulty: 'Beginner', muscle: 'Full Body · Arteries · Flexibility' },

    // ── ARTHRITIS / JOINT PAIN ────────────────────────────────
    { id: 'art_water', category: 'arthritis',
      conditions: ['arthritis', 'obesity', 'back'],
      emoji: '🏊', title: 'Aqua / Water Aerobics',
      desc: 'Water provides 75% weight support. Pain-free exercise that reduces inflammation while building muscle.',
      sets: '1 session', reps: '30 minutes', duration: 1800, calories: 200,
      difficulty: 'Beginner', muscle: 'Full Body · Joints · Cardio' },

    { id: 'art_stretch', category: 'arthritis',
      conditions: ['arthritis', 'back', 'fitness'],
      emoji: '🤸', title: 'Range-of-Motion Stretching',
      desc: 'Daily gentle stretching of affected joints reduces stiffness by 40%. Slow, pain-free movement arcs.',
      sets: '2 sets', reps: '10–15 per joint', duration: 300, calories: 10,
      difficulty: 'Beginner', muscle: 'Joints · Flexibility · Tendons' },

    { id: 'art_chair', category: 'arthritis',
      conditions: ['arthritis', 'heart', 'back'],
      emoji: '🪑', title: 'Chair-Based Strength',
      desc: 'Seated leg raises, arm circles, and ankle pumps. Maintains muscle mass without any joint impact stress.',
      sets: '2 sets', reps: '12 each exercise', duration: 240, calories: 8,
      difficulty: 'Beginner', muscle: 'Legs · Arms · Joints' },

    // ── STRESS / ANXIETY / DEPRESSION ─────────────────────────
    { id: 'stress_run', category: 'stress',
      conditions: ['stress', 'anxiety', 'depression', 'obesity'],
      emoji: '🏃‍♂️', title: 'Aerobic Running (Mood Boost)',
      desc: 'Running releases endorphins and serotonin within 10 minutes. 30 min/day reduces anxiety symptoms by 48%.',
      sets: '1 session', reps: '30 minutes', duration: 1800, calories: 250,
      difficulty: 'Intermediate', muscle: 'Cardio · Full Body · Brain' },

    { id: 'stress_yoga', category: 'stress',
      conditions: ['stress', 'anxiety', 'depression', 'hypertension'],
      emoji: '🌿', title: 'Restorative Yoga (De-Stress)',
      desc: 'Yoga Nidra, Legs-Up-the-Wall, and forward folds activate the vagus nerve, lowering cortisol.',
      sets: '1 session', reps: '20 minutes', duration: 1200, calories: 35,
      difficulty: 'Beginner', muscle: 'Nervous System · Flexibility · Mental' },

    { id: 'stress_meditate', category: 'stress',
      conditions: ['stress', 'anxiety', 'hypertension', 'heart'],
      emoji: '🧠', title: 'Mindfulness Meditation',
      desc: 'Just 10 min of mindfulness meditation daily reduces amygdala reactivity and cortisol by up to 23%.',
      sets: '1 session', reps: '10–15 minutes', duration: 600, calories: 3,
      difficulty: 'Beginner', muscle: 'Brain · Nervous System' },

    // ── BACK PAIN ──────────────────────────────────────────────
    { id: 'back_cat', category: 'back',
      conditions: ['back', 'fitness'],
      emoji: '🐈', title: 'Cat-Cow Stretch',
      desc: 'Spinal flexion & extension with breathing. Reduces lumbar disc pressure, improves spinal mobility.',
      sets: '3 rounds', reps: '10 slow breaths', duration: 120, calories: 3,
      difficulty: 'Beginner', muscle: 'Spine · Core · Back Muscles' },

    { id: 'back_bird', category: 'back',
      conditions: ['back', 'fitness'],
      emoji: '🦅', title: 'Bird-Dog Exercise',
      desc: 'Opposite arm + leg extension. Builds deep stabilizer muscles around the spine to reduce chronic back pain.',
      sets: '3 sets', reps: '10 each side', duration: 90, calories: 6,
      difficulty: 'Beginner', muscle: 'Lower Back · Core · Glutes' },

    { id: 'back_child', category: 'back',
      conditions: ['back', 'stress'],
      emoji: '🧸', title: "Child's Pose",
      desc: "Passive stretch decompressing the lumbar spine, stretching hips and thighs. Immediate back pain relief.",
      sets: '3 holds', reps: '45 seconds each', duration: 135, calories: 2,
      difficulty: 'Beginner', muscle: 'Lower Back · Hips · Glutes' },

    { id: 'back_pelvic', category: 'back',
      conditions: ['back', 'arthritis'],
      emoji: '🔄', title: 'Pelvic Tilts',
      desc: 'Lie on back, gently tilt pelvis up and hold. Strengthens deep core mscles and relieves lower back tension.',
      sets: '3 sets', reps: '15 tilts', duration: 90, calories: 4,
      difficulty: 'Beginner', muscle: 'Lower Back · Pelvis · Core' },

    // ── PCOS / PCOD ────────────────────────────────────────────
    { id: 'pcos_hiit', category: 'pcos',
      conditions: ['pcos', 'obesity', 'diabetes'],
      emoji: '⚡', title: 'HIIT for PCOS',
      desc: 'Short-burst intervals regulate insulin, reduce testosterone levels, and reduce cyst formation. 3x/week optimal.',
      sets: '4 rounds', reps: '30s work / 30s rest', duration: 240, calories: 40,
      difficulty: 'Intermediate', muscle: 'Full Body · Hormonal System' },

    { id: 'pcos_yoga', category: 'pcos',
      conditions: ['pcos', 'stress', 'diabetes'],
      emoji: '🌸', title: 'Yoga for PCOS',
      desc: 'Butterfly, Cobra, and Bridge Pose stimulate the ovaries, balance hormones, reduce cortisol in PCOS.',
      sets: '1 session', reps: '25 minutes', duration: 1500, calories: 55,
      difficulty: 'Beginner', muscle: 'Core · Pelvis · Hormonal System' },

    { id: 'pcos_strength', category: 'pcos',
      conditions: ['pcos', 'obesity', 'fitness'],
      emoji: '🏋️‍♀️', title: 'Strength Training for PCOS',
      desc: 'Building muscle mass improves insulin sensitivity significantly, which is the core driver of PCOS symptoms.',
      sets: '3 sets', reps: '12 reps each', duration: 900, calories: 90,
      difficulty: 'Intermediate', muscle: 'Full Body · Muscle · Metabolism' },

    // ── THYROID ────────────────────────────────────────────────
    { id: 'thy_aerobic', category: 'thyroid',
      conditions: ['thyroid', 'obesity', 'fitness'],
      emoji: '🦋', title: 'Aerobic Exercise for Thyroid',
      desc: 'Daily 30-min aerobic activity boosts T3/T4 conversion, reduces fatigue in hypothyroid patients.',
      sets: '1 session', reps: '30 minutes', duration: 1800, calories: 150,
      difficulty: 'Beginner', muscle: 'Cardio · Metabolism · Energy' },

    { id: 'thy_yoga', category: 'thyroid',
      conditions: ['thyroid', 'stress'],
      emoji: '🧘‍♀️', title: 'Thyroid Yoga (Sarvangasana)',
      desc: "Shoulder Stand and Fish Pose stimulate the thyroid gland by increasing blood flow to the neck area.",
      sets: '2 sets', reps: '30–60 seconds', duration: 120, calories: 8,
      difficulty: 'Intermediate', muscle: 'Thyroid · Neck · Core' },

    // ── CHOLESTEROL ────────────────────────────────────────────
    { id: 'chol_run', category: 'cholesterol',
      conditions: ['cholesterol', 'obesity', 'heart'],
      emoji: '🏃', title: 'Jogging for Cholesterol',
      desc: 'Aerobic exercise for 30 min raises HDL (good) cholesterol by 5–10% and significantly reduces LDL.',
      sets: '1 session', reps: '30 minutes', duration: 1800, calories: 200,
      difficulty: 'Intermediate', muscle: 'Cardio · Full Body · Lipid Metabolism' },

    { id: 'chol_swim', category: 'cholesterol',
      conditions: ['cholesterol', 'arthritis', 'obesity', 'heart'],
      emoji: '🏊', title: 'Swimming for Cholesterol',
      desc: 'Low-impact, full-body aerobic exercise. 45 min of swimming lowers LDL cholesterol as effectively as jogging.',
      sets: '1 session', reps: '30–45 minutes', duration: 2700, calories: 280,
      difficulty: 'Beginner', muscle: 'Full Body · Cardio · Lipids' },
];

// ── STATE ──────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const STORAGE_KEY = `workout_done_${today}`;
let doneIds         = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
let activeFilter    = 'all';
let personalizedTags = [];   // tags from /api/workout_recommendations
let timerInterval   = null;
let timerRemaining  = 0;
let timerTotal      = 0;
let timerPaused     = false;
let activeWorkoutId = null;

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    updateProgress();
    setupTabs();
    setupTimer();
    setupReset();
    setupAIGuide();
    fetchPersonalizedRecommendations();
    loadWorkoutFromServer();
});

// ── PERSONALIZATION ────────────────────────────────────────────
function fetchPersonalizedRecommendations() {
    fetch('/api/workout_recommendations')
        .then(r => r.json())
        .then(data => {
            personalizedTags = data.detected_tags || [];

            // Show/hide banner
            if (personalizedTags.length > 0 || data.ai_advice) {
                showPersonalizedBanner(data);
            }

            // Show "For You" tab
            if (personalizedTags.length > 0) {
                const tab = document.getElementById('for-you-tab');
                if (tab) tab.classList.remove('hidden');
            }

            // Show AI advice card for unknown conditions
            if (data.ai_advice) {
                renderAIAdviceCard(data.ai_advice);
            }
        })
        .catch(err => {
            console.error(err);
            showToast('Something went wrong. Please try again.', 'error');
        }); // Silently fail if not logged in
}

function showPersonalizedBanner(data) {
    const banner = document.getElementById('personal-banner');
    if (!banner) return;
    banner.classList.remove('hidden');

    const condText = document.getElementById('banner-conditions');
    const title = document.getElementById('banner-title');

    if (data.detected_tags && data.detected_tags.length > 0) {
        const labels = data.detected_tags.map(t => CAT_META[t] ? CAT_META[t].label : t);
        if (condText) condText.textContent = `Based on your profile: ${data.conditions_text} — targeted exercises are highlighted below.`;
        if (title) title.textContent = '⚕️ Personalized Workout Plan Ready';
    } else if (data.ai_advice) {
        if (condText) condText.textContent = `AI-generated exercises for: ${data.conditions_text}`;
        if (title) title.textContent = '🤖 AI-Customized Plan';
    }

    const btn = document.getElementById('banner-goto-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            const forYouTab = document.getElementById('for-you-tab');
            if (forYouTab && !forYouTab.classList.contains('hidden')) {
                forYouTab.click();
            } else {
                const aiCard = document.getElementById('ai-advice-card');
                if (aiCard) aiCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
}

function renderAIAdviceCard(advice) {
    const card = document.getElementById('ai-advice-card');
    const label = document.getElementById('ai-condition-label');
    const grid = document.getElementById('ai-exercises-grid');
    if (!card || !grid) return;

    if (label) label.textContent = advice.condition_label || 'Custom Condition Plan';

    grid.innerHTML = '';
    (advice.exercises || []).forEach(ex => {
        const div = document.createElement('div');
        div.className = 'ai-exercise-item';
        div.innerHTML = `
            <div class="ai-ex-emoji">${ex.emoji || '🏃'}</div>
            <div class="ai-ex-info">
                <strong>${ex.name}</strong>
                <span class="ai-ex-dur">⏱ ${ex.duration}</span>
                <p>${ex.benefit}</p>
            </div>
        `;
        grid.appendChild(div);
    });

    card.classList.remove('hidden');
}

// ── RENDER CARDS ───────────────────────────────────────────────
function renderCards() {
    const grid = document.getElementById('workout-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let filtered;
    if (activeFilter === 'personal') {
        // Show exercises matching any of the user's detected condition tags
        filtered = WORKOUTS.filter(w =>
            w.conditions.some(c => personalizedTags.includes(c)) ||
            personalizedTags.includes(w.category)
        );
    } else if (activeFilter === 'all') {
        filtered = WORKOUTS;
    } else {
        filtered = WORKOUTS.filter(w => w.category === activeFilter);
    }

    document.getElementById('exercises-total').textContent = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:3rem;">No exercises found for this filter.</div>';
        return;
    }

    filtered.forEach(w => {
        const done = doneIds.has(w.id);
        const meta = CAT_META[w.category] || { color: '#00f0ff', label: w.category };
        const isPersonalized = personalizedTags.length > 0 &&
            (personalizedTags.includes(w.category) || w.conditions.some(c => personalizedTags.includes(c)));

        const card = document.createElement('div');
        card.className = `workout-card cat-${w.category} ${done ? 'done' : ''} ${isPersonalized ? 'personalized' : ''}`;
        card.id = `card-${w.id}`;

        card.innerHTML = `
            ${isPersonalized ? '<div class="personal-badge">🎯 Recommended for You</div>' : ''}
            <div class="card-header">
                <div class="card-emoji">${w.emoji}</div>
                <div>
                    <div class="card-title">${w.title}</div>
                    <span class="card-cat-tag" style="background:${meta.color}18;color:${meta.color};border:1px solid ${meta.color}33;">${meta.label}</span>
                </div>
            </div>
            <p class="card-desc">${w.desc}</p>
            <div class="card-meta">
                <span class="meta-pill">📟 ${w.sets}</span>
                <span class="meta-pill">🔁 ${w.reps}</span>
                <span class="meta-pill">🔥 ~${w.calories} kcal</span>
                <span class="meta-pill">⚡ ${w.difficulty}</span>
            </div>
            <div class="card-meta" style="margin-top:-0.6rem;">
                <span class="meta-pill">💪 ${w.muscle}</span>
            </div>
            <div class="card-actions">
                <button class="btn-start-timer" data-id="${w.id}">⏱ Start Timer</button>
                <button class="btn-mark-done ${done ? 'undone' : ''}" data-id="${w.id}">
                    ${done ? '↩ Undo' : '✅ Mark Done'}
                </button>
            </div>
        `;

        card.querySelector('.btn-start-timer').addEventListener('click', e => { e.stopPropagation(); openTimer(w.id); });
        card.querySelector('.btn-mark-done').addEventListener('click', e => { e.stopPropagation(); toggleDone(w.id); });

        grid.appendChild(card);
    });

    syncDoneCount();
}

// ── DONE TOGGLE ────────────────────────────────────────────────
function toggleDone(id) {
    if (doneIds.has(id)) { doneIds.delete(id); } else { doneIds.add(id); }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...doneIds]));

    const card = document.getElementById(`card-${id}`);
    if (card) {
        card.classList.toggle('done', doneIds.has(id));
        const btn = card.querySelector('.btn-mark-done');
        if (btn) {
            btn.textContent = doneIds.has(id) ? '↩ Undo' : '✅ Mark Done';
            btn.classList.toggle('undone', doneIds.has(id));
        }
    }
    updateProgress();
    syncDoneCount();
    syncWorkoutToServer();
}

function syncDoneCount() {
    const visibleCards = document.querySelectorAll('#workout-grid .workout-card');
    const doneVisible = [...visibleCards].filter(c => c.classList.contains('done')).length;
    const doneEl = document.getElementById('exercises-done');
    if (doneEl) doneEl.textContent = doneVisible;
}

// ── PROGRESS RING ──────────────────────────────────────────────
function updateProgress() {
    const total = WORKOUTS.length;
    const done  = WORKOUTS.filter(w => doneIds.has(w.id)).length;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

    const circ = 2 * Math.PI * 50;
    const offset = circ - (pct / 100) * circ;
    const ring = document.getElementById('ring-fill');
    if (ring) {
        ring.style.strokeDasharray = circ;
        ring.style.strokeDashoffset = offset;
        if (pct < 40)      { ring.style.stroke = '#f59e0b'; ring.style.filter = 'drop-shadow(0 0 8px #f59e0b)'; }
        else if (pct < 75) { ring.style.stroke = '#00f0ff'; ring.style.filter = 'drop-shadow(0 0 8px #00f0ff)'; }
        else               { ring.style.stroke = '#34d399'; ring.style.filter = 'drop-shadow(0 0 8px #34d399)'; }
    }

    const pctEl = document.getElementById('ring-pct');
    if (pctEl) pctEl.textContent = pct + '%';

    const msg = document.getElementById('progress-msg');
    if (msg) {
        if (done === 0)         msg.textContent = 'Start your workout to track progress!';
        else if (pct < 40)      msg.textContent = `Great start! ${done} of ${total} exercises done. Keep going! 💪`;
        else if (pct < 75)      msg.textContent = `Halfway there! ${done}/${total} done. You're amazing! 🔥`;
        else if (pct < 100)     msg.textContent = `Almost done! ${total - done} exercises to go. Finish strong! ⚡`;
        else                    msg.textContent = `🎉 Perfect workout! All ${total} exercises complete!`;
    }

    const totalCal = WORKOUTS.filter(w => doneIds.has(w.id)).reduce((s, w) => s + w.calories, 0);
    const calEl = document.getElementById('calories-burned');
    if (calEl) calEl.textContent = totalCal;
}

// ── TABS ───────────────────────────────────────────────────────
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderCards();
        });
    });
}

// ── RESET ──────────────────────────────────────────────────────
function setupReset() {
    document.getElementById('reset-workout-btn').addEventListener('click', () => {
        if (confirm('Reset all workout progress for today?')) {
            doneIds.clear();
            localStorage.removeItem(STORAGE_KEY);
            renderCards();
            updateProgress();
            syncWorkoutToServer();
        }
    });
}

// ── SERVER SYNC ────────────────────────────────────────────────
function syncWorkoutToServer() {
    const totalCal = WORKOUTS.filter(w => doneIds.has(w.id)).reduce((s, w) => s + w.calories, 0);
    fetch('/api/workout_log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            calories_burned: totalCal,
            exercises_done: doneIds.size,
            done_ids: [...doneIds]
        })
    }).then(() => loadCalorieChart()).catch(err => {
            console.error(err);
            showToast('Something went wrong. Please try again.', 'error');
        });
}

function loadWorkoutFromServer() {
    fetch('/api/workout_log')
        .then(r => r.json())
        .then(data => {
            // Restore today's done exercises from server
            if (data.today && data.today.done_ids && data.today.done_ids.length > 0) {
                data.today.done_ids.forEach(id => doneIds.add(id));
                localStorage.setItem(STORAGE_KEY, JSON.stringify([...doneIds]));
                renderCards();
                updateProgress();
            }
            // Render calorie history chart
            if (data.history) {
                renderCalorieChart(data.history);
            }
        })
        .catch(err => {
            console.error(err);
            showToast('Something went wrong. Please try again.', 'error');
        });
}

// ── 7-DAY CALORIE CHART (SVG) ─────────────────────────────────
function loadCalorieChart() {
    fetch('/api/workout_log')
        .then(r => r.json())
        .then(data => {
            if (data.history) renderCalorieChart(data.history);
        })
        .catch(err => {
            console.error(err);
            showToast('Something went wrong. Please try again.', 'error');
        });
}

function renderCalorieChart(history) {
    const container = document.getElementById('calorie-chart-container');
    if (!container) return;

    // Fill up to 7 days
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const found = history.find(h => h.date === dateStr);
        days.push({
            date: dateStr,
            dayName: dayNames[d.getDay()],
            calories: found ? found.calories_burned : 0,
            exercises: found ? found.exercises_done : 0,
            isToday: i === 0
        });
    }

    const maxCal = Math.max(100, ...days.map(d => d.calories));
    const weekTotal = days.reduce((s, d) => s + d.calories, 0);

    // Update week total pill
    const weekEl = document.getElementById('week-total-cal');
    if (weekEl) weekEl.textContent = Math.round(weekTotal);

    // SVG dimensions
    const svgW = 800, svgH = 200;
    const barW = 60, gap = 30;
    const totalBarsW = days.length * (barW + gap) - gap;
    const startX = (svgW - totalBarsW) / 2;
    const barMaxH = 140;

    let svgHTML = `<svg class="chart-svg" viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="xMidYMid meet">`;

    // Grid lines
    for (let i = 0; i <= 4; i++) {
        const y = svgH - 30 - (barMaxH * i / 4);
        const val = Math.round(maxCal * i / 4);
        svgHTML += `<line x1="${startX - 20}" y1="${y}" x2="${startX + totalBarsW + 10}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
        svgHTML += `<text x="${startX - 28}" y="${y + 4}" fill="rgba(255,255,255,0.2)" font-size="9" text-anchor="end" class="chart-val-label">${val}</text>`;
    }

    days.forEach((day, i) => {
        const x = startX + i * (barW + gap);
        const h = day.calories > 0 ? Math.max(4, (day.calories / maxCal) * barMaxH) : 4;
        const y = svgH - 30 - h;

        const color = day.isToday ? '#00f0ff' : '#a855f7';
        const opacity = day.calories > 0 ? 1 : 0.3;

        svgHTML += `<g class="chart-bar-group">`;
        // Bar with rounded top
        svgHTML += `<rect class="chart-bar" x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" ry="6" fill="${color}" opacity="${opacity}" />`;
        // Glow
        if (day.calories > 0) {
            svgHTML += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="6" ry="6" fill="${color}" opacity="0.15" filter="blur(4px)" />`;
        }
        // Value on top
        if (day.calories > 0) {
            svgHTML += `<text x="${x + barW / 2}" y="${y - 6}" fill="${color}" font-size="11" font-weight="800" text-anchor="middle" class="chart-val-label">${Math.round(day.calories)}</text>`;
        }
        // Day label
        svgHTML += `<text x="${x + barW / 2}" y="${svgH - 10}" fill="${day.isToday ? '#00f0ff' : 'rgba(255,255,255,0.4)'}" font-size="11" font-weight="${day.isToday ? '800' : '500'}" text-anchor="middle" class="chart-day-label">${day.dayName}</text>`;
        // Today indicator
        if (day.isToday) {
            svgHTML += `<text x="${x + barW / 2}" y="${svgH}" fill="#00f0ff" font-size="8" font-weight="700" text-anchor="middle" class="chart-today-label">TODAY</text>`;
        }
        // Tooltip
        svgHTML += `<title>${day.dayName} (${day.date}): ${Math.round(day.calories)} kcal burned, ${day.exercises} exercises</title>`;
        svgHTML += `</g>`;
    });

    svgHTML += `</svg>`;
    container.innerHTML = svgHTML;
}

// ── TIMER ──────────────────────────────────────────────────────
function setupTimer() {
    document.getElementById('close-timer').addEventListener('click', closeTimer);
    document.getElementById('timer-start').addEventListener('click', startTimer);
    document.getElementById('timer-pause').addEventListener('click', pauseTimer);
    document.getElementById('btn-done-timer').addEventListener('click', () => {
        if (activeWorkoutId) { toggleDone(activeWorkoutId); }
        closeTimer();
    });
}

function openTimer(id) {
    const w = WORKOUTS.find(x => x.id === id);
    if (!w) return;
    activeWorkoutId = id;
    timerRemaining  = w.duration;
    timerTotal      = w.duration;
    timerPaused     = false;
    clearInterval(timerInterval);
    timerInterval = null;

    document.getElementById('timer-exercise-name').textContent = `${w.emoji} ${w.title}`;
    document.getElementById('timer-start').textContent = '▶ Start';
    document.getElementById('timer-pause').textContent = '⏸ Pause';
    updateTimerDisplay();
    updateTimerRing();
    document.getElementById('timer-modal').classList.remove('hidden');
}

function closeTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    activeWorkoutId = null;
    document.getElementById('timer-modal').classList.add('hidden');
}

function startTimer() {
    if (timerInterval) return;
    timerPaused = false;
    document.getElementById('timer-start').textContent = '⏱ Running…';
    timerInterval = setInterval(() => {
        if (!timerPaused) {
            timerRemaining--;
            updateTimerDisplay();
            updateTimerRing();
            if (timerRemaining <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                document.getElementById('timer-countdown').textContent = 'Done!';
                if (activeWorkoutId) { toggleDone(activeWorkoutId); setTimeout(closeTimer, 1500); }
            }
        }
    }, 1000);
}

function pauseTimer() {
    timerPaused = !timerPaused;
    const btn = document.getElementById('timer-pause');
    if (btn) btn.textContent = timerPaused ? '▶ Resume' : '⏸ Pause';
}

function updateTimerDisplay() {
    const m = Math.floor(timerRemaining / 60);
    const s = timerRemaining % 60;
    const el = document.getElementById('timer-countdown');
    if (el) el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function updateTimerRing() {
    const circ = 2 * Math.PI * 50;
    const ring = document.getElementById('timer-ring');
    if (ring) ring.style.strokeDashoffset = circ - ((timerRemaining / timerTotal) * circ);
}

// ── AI GUIDE (Ask AI Coach) ────────────────────────────────────
function setupAIGuide() {
    const input  = document.getElementById('ai-guide-input');
    const btn    = document.getElementById('btn-ask-ai');
    const label  = document.getElementById('ask-ai-label');
    if (!input || !btn) return;

    // Example chips pre-fill textarea
    document.querySelectorAll('.example-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.dataset.msg;
            input.focus();
            input.style.borderColor = 'rgba(0,240,255,0.5)';
        });
    });

    // Ctrl+Enter submits
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            btn.click();
        }
    });

    btn.addEventListener('click', async () => {
        const msg = input.value.trim();
        if (!msg) {
            input.style.borderColor = 'rgba(248,113,113,0.5)';
            input.placeholder = 'Please type your question or condition first…';
            setTimeout(() => {
                input.style.borderColor = '';
                input.placeholder = "e.g. I have migraine headaches and want exercises that won't trigger them...";
            }, 2000);
            return;
        }

        // Loading state
        btn.disabled = true;
        btn.classList.add('loading');
        if (label) label.textContent = '⏳ Thinking…';

        // Hide previous response
        const responseEl = document.getElementById('ai-guide-response');
        if (responseEl) responseEl.classList.add('hidden');

        try {
            const res = await fetch('/api/workout_ai_guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });
            const data = await res.json();
            renderAIGuideResponse(data);
        } catch (e) {
            renderAIGuideResponse({
                reply: "Sorry, I couldn't connect to the AI right now. Here's a general safe plan!",
                plan_title: 'General Wellness Plan',
                exercises: [
                    { name: 'Brisk Walking',     emoji: '🚶', duration: '30 min', benefit: 'Boosts cardio and mood.' },
                    { name: 'Deep Breathing',    emoji: '🫁', duration: '10 min', benefit: 'Reduces stress hormones.' },
                    { name: 'Gentle Stretching', emoji: '🤸', duration: '15 min', benefit: 'Improves flexibility and joint health.' },
                ],
                tip: 'Consistency is key — even 10 minutes daily makes a difference!'
            });
        } finally {
            btn.disabled = false;
            btn.classList.remove('loading');
            if (label) label.textContent = '✨ Ask AI';
        }
    });
}

function renderAIGuideResponse(data) {
    const responseEl = document.getElementById('ai-guide-response');
    const bubble     = document.getElementById('ai-reply-bubble');
    const title      = document.getElementById('ai-plan-title');
    const exGrid     = document.getElementById('ai-guide-exercises');
    const tip        = document.getElementById('ai-guide-tip');
    if (!responseEl) return;

    // Reply bubble
    if (bubble) bubble.textContent = data.reply || '';

    // Plan title
    if (title) title.textContent = data.plan_title ? `📋 ${data.plan_title}` : '';

    // Exercise cards
    if (exGrid) {
        exGrid.innerHTML = '';
        (data.exercises || []).forEach(ex => {
            const card = document.createElement('div');
            card.className = 'ai-guide-ex-card';
            card.innerHTML = `
                <div class="ai-g-emoji">${ex.emoji || '🏃'}</div>
                <div class="ai-g-info">
                    <strong>${ex.name}</strong>
                    <span class="ai-g-dur">⏱ ${ex.duration}</span>
                    <p>${ex.benefit}</p>
                </div>
            `;
            exGrid.appendChild(card);
        });
    }

    // Motivational tip
    if (tip) {
        tip.textContent = data.tip ? `💡 ${data.tip}` : '';
        tip.style.display = data.tip ? '' : 'none';
    }

    // Reveal with animation
    responseEl.classList.remove('hidden');
    responseEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showToast(message, type='info') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:12px 20px; border-radius:8px; z-index:9999; color:white; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.5); cursor:pointer; min-width:250px; text-align:center; transition: opacity 0.3s;';
        document.body.appendChild(toast);
        toast.addEventListener('click', () => { toast.style.display = 'none'; });
    }
    toast.style.display = 'block';
    toast.style.opacity = '1';
    toast.textContent = message;
    toast.style.background = (type === 'error') ? 'var(--danger, #ff0055)' : 'var(--primary, #00f0ff)';
    toast.style.color = (type === 'error') ? '#fff' : '#000';
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        setTimeout(() => { toast.style.display = 'none'; }, 300); 
    }, 3000);
}
