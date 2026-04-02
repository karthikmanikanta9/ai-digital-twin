document.addEventListener("DOMContentLoaded", () => {
    function safeSet(el, prop, val) {
        if (el) el[prop] = val;
    }
    function safeStyle(el, prop, val) {
        if (el && el.style) el.style[prop] = val;
    }
    const inputs = ['age', 'sleep', 'exercise', 'height', 'weight'];
    
    // UI Elements
    const elements = {
        scoreCircle: document.getElementById('score-circle'),
        scoreText: document.getElementById('score-text'),
        heartBar: document.getElementById('heart-bar'),
        heartVal: document.getElementById('heart-val'),
        diabetesBar: document.getElementById('diabetes-bar'),
        diabetesVal: document.getElementById('diabetes-val'),
        obesityBar: document.getElementById('obesity-bar'),
        obesityVal: document.getElementById('obesity-val'),
    };

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (moonIcon && sunIcon) {
            safeStyle(moonIcon, 'display', 'none');
            safeStyle(sunIcon, 'display', 'block');
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            if (moonIcon && sunIcon) {
                if (isLight) {
                    safeStyle(moonIcon, 'display', 'none');
                    safeStyle(sunIcon, 'display', 'block');
                } else {
                    safeStyle(moonIcon, 'display', 'block');
                    safeStyle(sunIcon, 'display', 'none');
                }
            }
        });
    }

    // Auth Modals logic
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-modal-btn');
    const registerBtn = document.getElementById('register-modal-btn');
    const closeBtn = document.querySelector('.close-btn');
    const authForm = document.getElementById('auth-form');
    const modalTitle = document.getElementById('modal-title');
    const submitAuth = document.getElementById('submit-auth');
    const authError = document.getElementById('auth-error');
    
    let isLogin = true;

    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal(true));
    }
    if (registerBtn) {
        registerBtn.addEventListener('click', () => openModal(false));
    }
    
    const loginLargeBtn = document.getElementById('login-large-btn');
    const registerLargeBtn = document.getElementById('register-large-btn');
    if (loginLargeBtn) loginLargeBtn.addEventListener('click', () => openModal(true));
    if (registerLargeBtn) registerLargeBtn.addEventListener('click', () => openModal(false));
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            fetch('/logout', { method: 'POST' })
            .then(() => window.location.reload());
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (authModal) authModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (authModal && e.target === authModal) {
            authModal.classList.remove('active');
        }
    });

    function openModal(login) {
        isLogin = login;
        if (modalTitle) modalTitle.textContent = login ? 'Login' : 'Sign Up';
        if (submitAuth) submitAuth.textContent = login ? 'Login' : 'Sign Up';
        if (authError) authError.textContent = '';
        
        const nameGroup = document.getElementById('name-group');
        const nameInput = document.getElementById('name');
        if (nameGroup && nameInput) {
            safeStyle(nameGroup, 'display', login ? 'none' : 'flex');
            safeSet(nameInput, 'required', !login);
        }

        if (authModal) authModal.classList.add('active');
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const payload = { email, password };
            if (!isLogin) {
                const nameInput = document.getElementById('name');
                if (nameInput) payload.name = nameInput.value;
            }
            
            const endpoint = isLogin ? '/login' : '/register';
            
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(({ status, body }) => {
                if (status === 200) {
                    window.location.reload();
                } else {
                    if (authError) authError.textContent = body.error || 'An error occurred';
                }
            })
            .catch(err => {
        console.error("Auth error:", err);
        showToast('Something went wrong. Please try again.', 'error');
    });
        });
    }

    // Load initial slider values from saved profile
    fetch('/get_data')
    .then(res => res.json())
    .then(data => {
        const sliderFields = ['age', 'height', 'weight', 'exercise'];
        if (data && Object.keys(data).length > 0) {
            sliderFields.forEach(id => {
                const input = document.getElementById(id);
                const valDisplay = document.getElementById(`${id}-val`);
                if (input && data[id] !== undefined && data[id] !== null) {
                    safeSet(input, 'value', data[id]);
                    if (valDisplay) valDisplay.textContent = parseFloat(data[id]).toFixed(0);
                }
            });
        }
        // Trigger simulation with loaded values
        triggerSimulation();
    })
    .catch(err => {
        console.error("Error fetching data:", err);
        triggerSimulation();
    });

    // Initialize listeners for dynamic dragging effect
    inputs.forEach(id => {
        const input = document.getElementById(id);
        const valDisplay = document.getElementById(`${id}-val`);
        
        if (input) {
            input.addEventListener('input', () => {
                if (valDisplay) valDisplay.textContent = input.value;
                triggerSimulation();
            });
        }
    });

    let timeoutId;

    // Simulation Request Control
    function triggerSimulation() {
        // Debounce allows smooth slider dragging without overwhelming the API
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            const data = {};
            const ageEl = document.getElementById('age');
            const sleepEl = document.getElementById('sleep');
            const exerciseEl = document.getElementById('exercise');
            const heightEl = document.getElementById('height');
            const weightEl = document.getElementById('weight');
            
            if(ageEl) data.age = parseFloat(ageEl.value);
            if(sleepEl) data.sleep = parseFloat(sleepEl.value);
            if(exerciseEl) data.exercise = parseFloat(exerciseEl.value);
            if(heightEl) data.height = parseFloat(heightEl.value);
            if(weightEl) data.weight = parseFloat(weightEl.value);

            if (Object.keys(data).length > 0) {
                fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(results => updateDashboard(results))
                .catch(err => {
        console.error(err);
        showToast('Something went wrong. Please try again.', 'error');
    });
            }
        }, 80);
    }

    // Dashboard Data Updater Hook
    function updateDashboard(results) {
        if (results.error) return;

        // Update Height/Weight derived BMI
        const displayBmi = document.getElementById('display-bmi');
        const displayBmiCat = document.getElementById('display-bmi-cat');
        if (displayBmi) displayBmi.textContent = results.bmi;
        if (displayBmiCat) {
            safeSet(displayBmiCat, 'textContent', results.bmi_category);
            safeStyle(displayBmiCat, 'color', '#fff');
            if (results.bmi < 18.5) {
                safeStyle(displayBmiCat, 'backgroundColor', 'var(--warning)');
            } else if (results.bmi < 25) {
                safeStyle(displayBmiCat, 'backgroundColor', '#10b981'); // Green
            } else if (results.bmi < 30) {
                safeStyle(displayBmiCat, 'backgroundColor', 'var(--warning)');
            } else {
                safeStyle(displayBmiCat, 'backgroundColor', 'var(--danger)');
            }
        }

        // Update Circular Chart visually & functionally
        const score = results.health_score;
        if (elements.scoreCircle && elements.scoreText) {
            elements.scoreCircle.setAttribute('stroke-dasharray', `${score}, 100`);
            safeSet(elements.scoreText, 'textContent', `${Math.round(score)}%`);

            // Color Grading Shift based on Vitality Health Score
            if(score < 50) {
                safeStyle(elements.scoreCircle, 'stroke', 'var(--danger)');
                safeStyle(elements.scoreCircle, 'filter', 'drop-shadow(0 0 8px var(--danger))');
            } else if(score < 75) {
                safeStyle(elements.scoreCircle, 'stroke', 'var(--warning)');
                safeStyle(elements.scoreCircle, 'filter', 'drop-shadow(0 0 8px var(--warning))');
            } else {
                safeStyle(elements.scoreCircle, 'stroke', 'var(--primary)');
                safeStyle(elements.scoreCircle, 'filter', 'drop-shadow(0 0 8px var(--primary))');
            }
        }

        // Update Standard Progress Bars
        if (elements.heartBar && elements.heartVal) updateBar(elements.heartBar, elements.heartVal, results.heart_disease);
        if (elements.diabetesBar && elements.diabetesVal) updateBar(elements.diabetesBar, elements.diabetesVal, results.diabetes);
        if (elements.obesityBar && elements.obesityVal) updateBar(elements.obesityBar, elements.obesityVal, results.obesity);

        // Update Diet Schedule
        const dietContainer = document.getElementById('diet-schedule');
        if (dietContainer && results.ai_diet) {
            safeSet(dietContainer, 'innerHTML', '');
            results.ai_diet.forEach(meal => {
                const card = document.createElement('div');
                safeSet(card, 'className', 'meal-card');
                card.innerHTML = `
                    <div class="meal-time">${meal.time}</div>
                    <div class="meal-details">
                        <div class="meal-name">${meal.meal}</div>
                        <div class="meal-food">${meal.food}</div>
                    </div>
                `;
                dietContainer.appendChild(card);
            });
        }
    }

    function updateBar(barEl, valEl, value) {
        safeStyle(barEl, 'width', `${value}%`);
        safeSet(valEl, 'textContent', `${value}%`);
    }

    // =============================================
    // DIET QUALITY SCORE ENGINE
    // Auto rates nutrition based on user's biometrics & food tracker data
    // =============================================
    function calcPersonalizedTargets() {
        const age = parseFloat(document.getElementById('age')?.value || 30);
        const weight = parseFloat(document.getElementById('weight')?.value || 70);
        const height = parseFloat(document.getElementById('height')?.value || 170);
        const exercise = parseFloat(document.getElementById('exercise')?.value || 3);

        // Harris-Benedict BMR (Male base, adjusted below)
        const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

        // Activity multiplier based on exercise hrs/week
        let activityFactor = 1.375; // Lightly active default
        if (exercise <= 1) activityFactor = 1.2;
        else if (exercise <= 3) activityFactor = 1.375;
        else if (exercise <= 6) activityFactor = 1.55;
        else activityFactor = 1.725;

        const tdee = Math.round(bmr * activityFactor); // Total Daily Energy Expenditure

        // WHO / ICMR macro guidelines
        const targetProtein  = Math.round(weight * 0.8);        // 0.8g per kg body weight (WHO)
        const targetCarbs    = Math.round((tdee * 0.50) / 4);   // 50% of calories from carbs
        const targetFiber    = age > 50 ? 21 : 28;              // 28g for under 50 (IOM)
        const targetCalories = tdee;

        return { targetProtein, targetCarbs, targetFiber, targetCalories };
    }

    function getMacroMsg(ratio, name) {
        if (ratio === 0) return `No ${name} logged yet.`;
        if (ratio < 0.4) return `Very low ${name} — aim to add more ${name}-rich foods.`;
        if (ratio < 0.7) return `${name} intake is below target — keep adding more.`;
        if (ratio <= 1.1) return `✅ Great ${name} intake — on track!`;
        if (ratio <= 1.3) return `Slightly over ${name} target — consider balancing.`;
        return `⚠️ Significantly over ${name} target.`;
    }

    function updateDietQuality() {
        fetch('/api/nutrition?t=' + Date.now()).then(res => {
            if (res.ok) return res.json();
        }).then(data => {
            const { targetProtein, targetCarbs, targetFiber, targetCalories } = calcPersonalizedTargets();

            // Update calorie budget display
            const calsBudgetEl = document.getElementById('cals-budget');
            if (calsBudgetEl) calsBudgetEl.textContent = targetCalories;

            let eatenCarbs = 0, eatenProtein = 0, eatenFiber = 0, eatenCals = 0;

            if (data && data.dailyTotal) {
                eatenCarbs   = parseFloat(data.dailyTotal.carbs   || 0);
                eatenProtein = parseFloat(data.dailyTotal.protein || 0);
                eatenFiber   = parseFloat(data.dailyTotal.fiber   || 0);
                eatenCals    = parseFloat(data.dailyTotal.calories || 0);
            }

            // Update summary tiles
            const twinCarbs    = document.getElementById('twin-carbs');
            const twinProtein  = document.getElementById('twin-protein');
            const twinFiber    = document.getElementById('twin-fiber');
            const calsEaten    = document.getElementById('cals-eaten');
            const calsRemaining = document.getElementById('cals-remaining');
            
            if (twinCarbs)   twinCarbs.textContent   = eatenCarbs.toFixed(1);
            if (twinProtein) twinProtein.textContent = eatenProtein.toFixed(1);
            if (twinFiber)   twinFiber.textContent   = eatenFiber.toFixed(1);
            if (calsEaten)   calsEaten.textContent    = eatenCals.toFixed(0);
            if (calsRemaining) {
                const rem = Math.max(0, targetCalories - eatenCals);
                safeSet(calsRemaining, 'textContent', rem.toFixed(0));
            }

            // === Ratio Calculations ===
            const proteinRatio = eatenProtein / targetProtein;
            const carbsRatio   = eatenCarbs   / targetCarbs;
            const fiberRatio   = eatenFiber   / targetFiber;
            const calsRatio    = eatenCals    / targetCalories;

            // Update Diet Quality bars
            const setBar = (barId, msgId, eatId, tgtId, eaten, target, ratio) => {
                const bar = document.getElementById(barId);
                const msg = document.getElementById(msgId);
                const eatEl = document.getElementById(eatId);
                const tgtEl = document.getElementById(tgtId);
                if (eatEl) eatEl.textContent = eaten.toFixed(1);
                if (tgtEl) tgtEl.textContent = target;
                const pct = Math.min(ratio * 100, 115); // cap visually at 115%
                if (bar) bar.style.width = pct + '%';
                if (bar && ratio > 1.1) bar.style.opacity = '0.7';
                if (msg) msg.textContent = getMacroMsg(ratio, barId.replace('dq-','').replace('-bar',''));
            };

            setBar('dq-protein-bar','dq-protein-msg','dq-protein-eaten','dq-protein-target', eatenProtein, targetProtein, proteinRatio);
            setBar('dq-carbs-bar',  'dq-carbs-msg',  'dq-carbs-eaten',  'dq-carbs-target',   eatenCarbs,   targetCarbs,   carbsRatio);
            setBar('dq-fiber-bar',  'dq-fiber-msg',  'dq-fiber-eaten',  'dq-fiber-target',   eatenFiber,   targetFiber,   fiberRatio);
            setBar('dq-cals-bar',   'dq-cals-msg',   'dq-cals-eaten',   'dq-cals-target',    eatenCals,    targetCalories, calsRatio);

            // === Score Calculation (out of 100, max 98 — no perfect diet) ===
            const scoreMacro = (ratio) => {
                if (ratio === 0) return 0;
                if (ratio <= 1.0) return ratio * 25;
                return Math.max(0, 25 - (ratio - 1) * 30);
            };
            const rawScore = scoreMacro(proteinRatio) + scoreMacro(carbsRatio) + scoreMacro(fiberRatio) + scoreMacro(calsRatio);
            // Cap at 98 — no real diet is ever perfect
            const displayScore = eatenCals > 0 ? Math.min(98, Math.round(rawScore)) : 0;

            let gradeColor = 'var(--text-muted)', tip = 'Log your meals to get a live diet quality rating.';
            if (eatenCals > 0) {
                if (displayScore >= 88)     { gradeColor = '#3fb950'; tip = '🌟 Outstanding! Your nutrition is exceptionally balanced today.'; }
                else if (displayScore >= 75) { gradeColor = '#58d68d'; tip = '✅ Excellent balance! Very close to all your targets.'; }
                else if (displayScore >= 60) { gradeColor = '#58a6ff'; tip = '👍 Good job! A few macros need a small boost.'; }
                else if (displayScore >= 45) { gradeColor = 'var(--warning)'; tip = '⚠️ Moderate quality — try adding more protein or fiber-rich foods.'; }
                else if (displayScore >= 28) { gradeColor = '#ff7b54'; tip = '😟 Below average. Several macros are significantly off target.'; }
                else                         { gradeColor = 'var(--danger)'; tip = '❌ Very poor. Please log more meals or check your diet balance.'; }
            }

            const gradeEl = document.getElementById('diet-grade-letter');
            const badgeEl = document.getElementById('diet-grade-badge');
            const tipEl   = document.getElementById('diet-quality-tip');
            if (gradeEl) {
                safeSet(gradeEl, 'textContent', eatenCals > 0 ? displayScore : '–');
                safeStyle(gradeEl, 'color', gradeColor);
                safeStyle(gradeEl, 'fontSize', eatenCals > 0 ? '1.3rem' : '1.8rem');
            }
            if (badgeEl)  { badgeEl.style.borderColor = gradeColor; badgeEl.style.boxShadow = `0 0 20px ${gradeColor}55`; }
            if (tipEl)    tipEl.textContent = tip;

        }).catch(err => {
        console.error(err);
        showToast('Something went wrong. Please try again.', 'error');
    });
    }

    // Run on page load
    updateDietQuality();
    // Re-run when any slider changes (targets shift with body metrics)
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', () => updateDietQuality());
    });

    // =============================================
    // SLEEP TRACKER
    // =============================================

    // Helper: today's date string
    function todayStr() {
        return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    }

    let sleepHours = parseFloat(localStorage.getItem('sleepHours') || '7');

    const sleepSlider    = document.getElementById('sleep-slider');
    const sleepDisplay   = document.getElementById('sleep-hours-display');
    const sleepIncBtn    = document.getElementById('sleep-inc');
    const sleepDecBtn    = document.getElementById('sleep-dec');
    const logSleepBtn    = document.getElementById('log-sleep-btn');
    const sleepSavedMsg  = document.getElementById('sleep-saved-msg');

    function getSleepQuality(hrs) {
        if (hrs < 4)               return { label: 'Severely Deprived', emoji: '😵', color: 'var(--danger)',  tip: 'Critical: under 4hrs severely impairs cognition and immunity.',   cog: 20, cardio: 25, immune: 20, wt: 20 };
        if (hrs < 6)               return { label: 'Poor Sleep',        emoji: '😔', color: '#ff7b54',       tip: 'Poor sleep raises cortisol and increases disease risks.',          cog: 45, cardio: 40, immune: 40, wt: 45 };
        if (hrs < 7)               return { label: 'Below Optimal',     emoji: '😐', color: 'var(--warning)', tip: 'Slightly below recommended. Aim for at least 7 hours.',            cog: 65, cardio: 60, immune: 62, wt: 60 };
        if (hrs >= 7 && hrs <= 9)  return { label: 'Optimal Sleep',     emoji: '😴', color: '#3fb950',       tip: '7–9 hours is the ideal adult sleep range. Great job!',            cog: 95, cardio: 90, immune: 92, wt: 88 };
        if (hrs <= 11)             return { label: 'Slightly Long',      emoji: '🥱', color: 'var(--warning)', tip: 'Slightly oversleeping can cause fatigue and metabolic issues.',    cog: 72, cardio: 70, immune: 75, wt: 65 };
        return                            { label: 'Oversleeping',      emoji: '🛌', color: 'var(--danger)',  tip: 'Oversleeping is linked to higher risk of depression & disease.', cog: 50, cardio: 48, immune: 55, wt: 45 };
    }

    function renderSleepUI(hrs) {
        if (!sleepDisplay) return;
        safeSet(sleepDisplay, 'textContent', hrs.toFixed(1));
        if (sleepSlider) sleepSlider.value = hrs;

        const q = getSleepQuality(hrs);

        const labelEl  = document.getElementById('sleep-quality-label');
        const tipEl    = document.getElementById('sleep-quality-tip');
        const badgeEl  = document.getElementById('sleep-score-badge');

        if (labelEl)  { labelEl.textContent = q.label; labelEl.style.color = q.color; }
        if (tipEl)    tipEl.textContent = q.tip;
        if (badgeEl)  { badgeEl.textContent = q.emoji; badgeEl.style.borderColor = q.color; badgeEl.style.boxShadow = `0 0 20px ${q.color}55`; }

        const setBar = (barId, pctId, pct) => {
            const bar = document.getElementById(barId);
            const pctEl = document.getElementById(pctId);
            if (bar) bar.style.width = pct + '%';
            if (pctEl) pctEl.textContent = pct + '%';
        };
        setBar('sleep-cog-bar',    'sleep-cog-pct',    q.cog);
        setBar('sleep-cardio-bar', 'sleep-cardio-pct', q.cardio);
        setBar('sleep-immune-bar', 'sleep-immune-pct', q.immune);
        setBar('sleep-weight-bar', 'sleep-weight-pct', q.wt);
    }

    // Lock or unlock sleep button based on whether sleep was already logged today
    function applySleepLock(locked, dateLabel) {
        if (!logSleepBtn) return;
        if (locked) {
            safeSet(logSleepBtn, 'disabled', true);
            safeSet(logSleepBtn, 'textContent', '✅ Sleep Logged for Today');
            safeStyle(logSleepBtn, 'opacity', '0.6');
            safeStyle(logSleepBtn, 'cursor', 'not-allowed');
            if (sleepSavedMsg) {
                safeStyle(sleepSavedMsg, 'color', '#3fb950');
                safeSet(sleepSavedMsg, 'textContent', `✅ Your ${sleepHours}h sleep is already saved (${dateLabel}). Resets tomorrow at midnight!`);
            }
            // Disable slider & +/- buttons
            if (sleepSlider) sleepSlider.disabled = true;
            if (sleepIncBtn) { sleepIncBtn.disabled = true; sleepIncBtn.style.opacity = '0.4'; }
            if (sleepDecBtn) { sleepDecBtn.disabled = true; sleepDecBtn.style.opacity = '0.4'; }
        } else {
            safeSet(logSleepBtn, 'disabled', false);
            safeSet(logSleepBtn, 'textContent', '💾 Log Sleep & Update Score');
            safeStyle(logSleepBtn, 'opacity', '1');
            safeStyle(logSleepBtn, 'cursor', 'pointer');
            if (sleepSavedMsg) sleepSavedMsg.textContent = '';
            if (sleepSlider) sleepSlider.disabled = false;
            if (sleepIncBtn) { sleepIncBtn.disabled = false; sleepIncBtn.style.opacity = '1'; }
            if (sleepDecBtn) { sleepDecBtn.disabled = false; sleepDecBtn.style.opacity = '1'; }
        }
    }

    // Check server if sleep already logged today
    function checkSleepLockStatus() {
        fetch('/api/sleep_log_status')
            .then(r => r.json())
            .then(data => {
                if (data.logged) {
                    // Load previously saved sleep hours for display
                    const saved = localStorage.getItem('sleepHours');
                    if (saved) sleepHours = parseFloat(saved);
                    renderSleepUI(sleepHours);
                    applySleepLock(true, data.yesterday || data.today);
                } else {
                    applySleepLock(false, '');
                    renderSleepUI(sleepHours);
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Something went wrong. Please try again.', 'error');
                applySleepLock(false, '');
                renderSleepUI(sleepHours);
            });
    }

    if (sleepSlider) {
        checkSleepLockStatus(); // Check on page load

        sleepSlider.addEventListener('input', () => {
            sleepHours = parseFloat(sleepSlider.value);
            renderSleepUI(sleepHours);
        });
    }
    if (sleepIncBtn) {
        sleepIncBtn.addEventListener('click', () => {
            sleepHours = Math.min(14, parseFloat((sleepHours + 0.5).toFixed(1)));
            renderSleepUI(sleepHours);
        });
    }
    if (sleepDecBtn) {
        sleepDecBtn.addEventListener('click', () => {
            sleepHours = Math.max(2, parseFloat((sleepHours - 0.5).toFixed(1)));
            renderSleepUI(sleepHours);
        });
    }

    if (logSleepBtn) {
        logSleepBtn.addEventListener('click', async () => {
            if (logSleepBtn.disabled) return; // Safety guard
            localStorage.setItem('sleepHours', sleepHours);
            safeSet(logSleepBtn, 'textContent', '⏳ Saving...');
            safeSet(logSleepBtn, 'disabled', true);

            try {
                const age    = parseFloat(document.getElementById('age')?.value    || 30);
                const height = parseFloat(document.getElementById('height')?.value || 170);
                const weight = parseFloat(document.getElementById('weight')?.value || 70);

                // Run simulation with sleep factored in
                const predRes = await fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ age, height, weight, sleep: sleepHours, exercise: 3 })
                });
                const results = await predRes.json();
                updateDashboard(results);

                // Get diet score from badge
                const gradeEl = document.getElementById('diet-grade-letter');
                const dietScore = (gradeEl && !isNaN(parseInt(gradeEl.textContent)))
                                    ? parseInt(gradeEl.textContent) : 0;

                // Auto-save as YESTERDAY's snapshot (sleep at night → log next morning)
                await fetch('/api/snapshot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        vitality_score: results.health_score,
                        diet_score:     dietScore,
                        sleep_hours:    sleepHours,
                        bmi:            results.bmi,
                        bmi_category:   results.bmi_category,
                        heart_risk:     results.heart_disease,
                        diabetes_risk:  results.diabetes,
                        obesity_risk:   results.obesity,
                        date_override:  'yesterday'   // sleep was last night
                    })
                });

                // Lock the button so user can't log again today
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yLabel = yesterday.toISOString().slice(0, 10);
                applySleepLock(true, yLabel);

                if (sleepSavedMsg) {
                    safeStyle(sleepSavedMsg, 'color', '#3fb950');
                    safeSet(sleepSavedMsg, 'textContent', `✅ ${sleepHours}h sleep saved — Vitality updated! Resets tomorrow at midnight.`);
                }
                loadHistory(); // refresh 7-day cards

            } catch (e) {
                console.error('Sleep log error:', e);
                safeSet(logSleepBtn, 'textContent', '💾 Log Sleep & Update Score');
                safeSet(logSleepBtn, 'disabled', false);
                safeStyle(logSleepBtn, 'opacity', '1');
            }
        });
    }



    // =============================================
    // 7-DAY HEALTH HISTORY
    // =============================================

    function getScoreColor(score) {
        if (score >= 85) return '#3fb950';
        if (score >= 72) return '#58d68d';
        if (score >= 58) return '#58a6ff';
        if (score >= 42) return 'var(--warning)';
        return 'var(--danger)';
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        const today = new Date(); today.setHours(0,0,0,0);
        const diff = Math.round((today - d) / 86400000);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    function renderHistoryCards(records) {
        const container = document.getElementById('history-cards');
        const emptyMsg = document.getElementById('history-empty-msg');
        if (!container) return;
        safeSet(container, 'innerHTML', '');

        if (!records || records.length === 0) {
            if (emptyMsg) container.appendChild(emptyMsg);
            return;
        }

        records.forEach(day => {
            const color = getScoreColor(day.vitality_score);
            const card = document.createElement('div');
            card.style.cssText = `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-left: 4px solid ${color}; border-radius: 16px; padding: 1.2rem; transition: transform 0.2s;`;
            card.onmouseenter = () => card.style.transform = 'translateY(-3px)';
            card.onmouseleave = () => card.style.transform = 'translateY(0)';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                    <span style="font-weight:700; font-size:1rem; color:var(--text);">${formatDate(day.date)}</span>
                    <span style="font-size:0.8rem; color:var(--text-muted);">${day.date}</span>
                </div>
                <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:0.9rem;">
                    <span style="background:${color}22; color:${color}; border:1px solid ${color}44; padding:0.3rem 0.7rem; border-radius:20px; font-weight:800; font-size:1rem;">⚡ ${day.vitality_score}%</span>
                    <span style="background:rgba(88,166,255,0.1); color:#58a6ff; border:1px solid rgba(88,166,255,0.2); padding:0.3rem 0.7rem; border-radius:20px; font-size:0.85rem;">🍽 Diet: ${day.diet_score}</span>
                    <span style="background:rgba(0,240,255,0.08); color:var(--primary); border:1px solid rgba(0,240,255,0.15); padding:0.3rem 0.7rem; border-radius:20px; font-size:0.85rem;">🌙 ${day.sleep_hours}h sleep</span>
                </div>
                <div style="display:flex; gap:0.5rem; margin-bottom:0.9rem; font-size:0.8rem;">
                    <span style="color:var(--text-muted);">BMI: <strong style="color:var(--text);">${day.bmi} (${day.bmi_category})</strong></span>
                    <span style="color:var(--text-muted); margin-left:auto;">❤️ ${day.heart_risk}% | 🩸 ${day.diabetes_risk}%</span>
                </div>
                <div style="font-size:0.88rem; color:var(--text-muted); border-top:1px solid rgba(255,255,255,0.06); padding-top:0.7rem; line-height:1.5;">${day.remark}</div>
            `;
            container.appendChild(card);
        });
    }

    function loadHistory() {
        fetch('/api/history').then(r => r.json()).then(data => {
            renderHistoryCards(data);
        }).catch(err => {
            console.error(err);
            showToast('Something went wrong. Please try again.', 'error');
        });
    }

    // Load history on page open
    loadHistory();

    // Save Today button — makes fresh API calls to get reliable data
    const saveTodayBtn = document.getElementById('save-today-btn');
    if (saveTodayBtn) {
        saveTodayBtn.addEventListener('click', async () => {
            safeSet(saveTodayBtn, 'textContent', '⏳ Saving...');
            safeSet(saveTodayBtn, 'disabled', true);

            try {
                // Step 1: Collect slider values
                const age    = parseFloat(document.getElementById('age')?.value    || 30);
                const height = parseFloat(document.getElementById('height')?.value || 170);
                const weight = parseFloat(document.getElementById('weight')?.value || 70);
                const sleepHrs = parseFloat(localStorage.getItem('sleepHours') || '7');

                // Step 2: Get fresh simulation result
                const predRes = await fetch('/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ age, height, weight, sleep: sleepHrs, exercise: 3 })
                });
                const pred = await predRes.json();
                if (pred.error) throw new Error(pred.error);

                // Step 3: Get live diet score from badge (already computed)
                const gradeEl = document.getElementById('diet-grade-letter');
                const dietScore = (gradeEl && !isNaN(parseInt(gradeEl.textContent)))
                                    ? parseInt(gradeEl.textContent) : 0;

                // Step 4: Build snapshot payload
                const snapshotData = {
                    vitality_score: pred.health_score,
                    diet_score:     dietScore,
                    sleep_hours:    sleepHrs,
                    bmi:            pred.bmi,
                    bmi_category:   pred.bmi_category,
                    heart_risk:     pred.heart_disease,
                    diabetes_risk:  pred.diabetes,
                    obesity_risk:   pred.obesity,
                };

                // Step 5: POST to /api/snapshot
                const snapRes = await fetch('/api/snapshot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(snapshotData)
                });
                const snap = await snapRes.json();

                // Step 6: Update dashboard with fresh results & refresh history
                updateDashboard(pred);
                safeSet(saveTodayBtn, 'textContent', '✅ Saved!');
                setTimeout(() => { saveTodayBtn.textContent = '💾 Save Today'; }, 2500);
                loadHistory();

            } catch (err) {
                console.error('Snapshot save error:', err);
                safeSet(saveTodayBtn, 'textContent', '❌ Failed — Try Again');
                setTimeout(() => { saveTodayBtn.textContent = '💾 Save Today'; }, 3000);
            } finally {
                safeSet(saveTodayBtn, 'disabled', false);
            }
        });
    }


    let waterCount = 0;


    const waterMinus = document.getElementById('water-minus');
    const waterPlus = document.getElementById('water-plus');
    const waterDisplay = document.getElementById('water-count');
    if (waterPlus && waterMinus && waterDisplay) {
        waterPlus.addEventListener('click', () => {
            if(waterCount < 20) waterCount++;
            safeSet(waterDisplay, 'textContent', waterCount);
        });
        waterMinus.addEventListener('click', () => {
            if(waterCount > 0) waterCount--;
            safeSet(waterDisplay, 'textContent', waterCount);
        });
    }

    // Chat Logic
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggle && chatWindow && closeChat) {
        chatWindow.classList.remove('open');
        chatToggle.addEventListener('click', () => chatWindow.classList.add('open'));
        closeChat.addEventListener('click', () => chatWindow.classList.remove('open'));
    }

    if (chatSend && chatInput) {
        chatSend.addEventListener('click', sendMsg);
        chatInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') sendMsg();
        });
        
        function sendMsg() {
            const text = chatInput.value.trim();
            if(!text) return;
            
            const uMsg = document.createElement('div');
            safeSet(uMsg, 'className', 'msg user');
            safeSet(uMsg, 'textContent', text);
            chatMessages.appendChild(uMsg);
            safeSet(chatInput, 'value', '');
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Show typing indicator
            const typingMsg = document.createElement('div');
            safeSet(typingMsg, 'className', 'msg-wrapper');
            safeSet(typingMsg, 'innerHTML', `<div class="msg ai"><div class="loader" style="width: 20px; height: 20px; border-width: 2px;"></div></div>`);
            chatMessages.appendChild(typingMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Collect Context Data
            const context = {
                age: document.getElementById('age') ? document.getElementById('age').value : 'Unknown',
                weight: document.getElementById('weight') ? document.getElementById('weight').value : 'Unknown',
                height: document.getElementById('height') ? document.getElementById('height').value : 'Unknown',
                activity: document.getElementById('exercise') ? document.getElementById('exercise').value : 'Unknown',
                bmiCategory: document.getElementById('bmi-category') ? document.getElementById('bmi-category').textContent : 'Unknown'
            };

            fetch('/api/coach_chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, context: context })
            })
            .then(res => res.json())
            .then(data => {
                chatMessages.removeChild(typingMsg);
                const aiMsg = document.createElement('div');
                safeSet(aiMsg, 'className', 'msg-wrapper');
                safeSet(aiMsg, 'innerHTML', `<div class="msg ai">${data.reply}</div>`);
                chatMessages.appendChild(aiMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(err => {
                chatMessages.removeChild(typingMsg);
                const aiMsg = document.createElement('div');
                safeSet(aiMsg, 'className', 'msg-wrapper');
                safeSet(aiMsg, 'innerHTML', `<div class="msg ai">I am currently offline or disconnected.</div>`);
                chatMessages.appendChild(aiMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }
    }

    // Onboarding Logic
    const onboardingModal = document.getElementById('onboarding-modal');
    if (onboardingModal && document.getElementById('age')) {
        fetch('/api/profile').then(res => {
            if (res.ok) return res.json();
        }).then(profile => {
            if (!profile) {
                // Show onboarding
                onboardingModal.classList.add('active');
                safeStyle(onboardingModal, 'display', 'flex');
            }
        });
        
        let currentStep = 1;
        const totalSteps = 3;
        const obNext = document.getElementById('ob-next');
        const obPrev = document.getElementById('ob-prev');
        const obSubmit = document.getElementById('ob-submit');
        const obForm = document.getElementById('onboarding-form');
        
        function updateStep() {
            document.querySelectorAll('.onboarding-step').forEach((el, index) => {
                safeStyle(el, 'display', (index + 1 === currentStep) ? 'block' : 'none');
            });
            safeStyle(obPrev, 'visibility', currentStep > 1 ? 'visible' : 'hidden');
            if (currentStep === totalSteps) {
                safeStyle(obNext, 'display', 'none');
                safeStyle(obSubmit, 'display', 'block');
            } else {
                safeStyle(obNext, 'display', 'block');
                safeStyle(obSubmit, 'display', 'none');
            }
        }
        
        if (obNext) {
            obNext.addEventListener('click', () => {
                const stepEl = document.getElementById(`ob-step-${currentStep}`);
                if (stepEl) {
                    const invalidInputs = [...stepEl.querySelectorAll('input, select, textarea')].filter(el => !el.checkValidity());
                    if (invalidInputs.length > 0) {
                        invalidInputs[0].reportValidity();
                        return;
                    }
                }
                if(currentStep < totalSteps) { currentStep++; updateStep(); }
            });
        }
        if (obPrev) {
            obPrev.addEventListener('click', () => {
                if(currentStep > 1) { currentStep--; updateStep(); }
            });
        }
        
        if (obForm) {
            obForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const goals = Array.from(document.querySelectorAll('.ob-goal:checked')).map(cb => cb.value);
                
                const profileData = {
                    location: document.getElementById('ob-location').value,
                    gender: document.getElementById('ob-gender').value,
                    age: document.getElementById('ob-age').value,
                    height: document.getElementById('ob-height').value,
                    weight: document.getElementById('ob-weight').value,
                    activity_level: document.getElementById('ob-activity').value,
                    medical_conditions: document.getElementById('ob-medical').value,
                    goals: goals
                };
                
                fetch('/api/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profileData)
                }).then(() => {
                    onboardingModal.classList.remove('active');
                    safeStyle(onboardingModal, 'display', 'none');
                    window.location.reload();
                });
            });
        }
    }

    // Profile Modal Logic
    const profileModalBtn = document.getElementById('profile-modal-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeProfileModalBtn = document.getElementById('close-profile-modal');
    const profileForm = document.getElementById('profile-form');

    if (profileModalBtn && profileModal) {
        profileModalBtn.addEventListener('click', () => {
            fetch('/api/profile').then(res => res.json()).then(profile => {
                if (profile && Object.keys(profile).length > 0) {
                    document.getElementById('prof-location').value = profile.location || '';
                    document.getElementById('prof-gender').value = profile.gender || '';
                    document.getElementById('prof-activity').value = profile.activity_level || '';
                    document.getElementById('prof-medical').value = profile.medical_conditions || '';
                }
            });
            fetch('/get_data').then(res => res.json()).then(data => {
                if (data && Object.keys(data).length > 0) {
                    document.getElementById('prof-age').value = data.age || '';
                    document.getElementById('prof-height').value = data.height || '';
                    document.getElementById('prof-weight').value = data.weight || '';
                }
            });
            profileModal.classList.add('active');
            safeStyle(profileModal, 'display', 'flex');
        });

        closeProfileModalBtn.addEventListener('click', () => {
            profileModal.classList.remove('active');
            safeStyle(profileModal, 'display', 'none');
        });

        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const profileData = {
                location: document.getElementById('prof-location').value,
                gender: document.getElementById('prof-gender').value,
                age: document.getElementById('prof-age').value,
                height: document.getElementById('prof-height').value,
                weight: document.getElementById('prof-weight').value,
                activity_level: document.getElementById('prof-activity').value,
                medical_conditions: document.getElementById('prof-medical').value,
                goals: []
            };

            const btn = document.getElementById('prof-submit-btn');
            safeSet(btn, 'textContent', 'Saving...');
            
            fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            }).then(() => {
                safeSet(btn, 'textContent', 'Save Changes');
                profileModal.classList.remove('active');
                safeStyle(profileModal, 'display', 'none');
                window.location.reload();
            });
        });
    }

    // =============================================
    // AI WORKOUT PANEL (on Dashboard)
    // =============================================

    // Load today's workout stats
    function loadDashboardWorkoutStats() {
        fetch('/api/workout_log')
            .then(r => r.json())
            .then(data => {
                const doneEl = document.getElementById('ai-workout-done');
                const calEl = document.getElementById('ai-workout-cal');
                if (data.today) {
                    if (doneEl) doneEl.textContent = data.today.exercises_done || 0;
                    if (calEl) calEl.textContent = Math.round(data.today.calories_burned || 0);
                }
            })
            .catch(err => {
            console.error(err);
            showToast('Something went wrong. Please try again.', 'error');
        });
    }

    // Load AI recommended exercises
    function loadAIRecommendations() {
        fetch('/api/workout_recommendations')
            .then(r => r.json())
            .then(data => {
                const grid = document.getElementById('ai-rec-exercises');
                const badge = document.getElementById('ai-rec-badge');
                if (!grid) return;

                let exercises = [];
                let badgeText = '';

                if (data.detected_tags && data.detected_tags.length > 0) {
                    badgeText = `🎯 ${data.detected_tags.length} condition(s) detected`;

                    // Map preset exercises from detected tags
                    const PRESET_EXERCISES = {
                        'diabetes': [
                            { emoji: '🏃', name: 'Post-Meal Walk', duration: '15 min × 3', benefit: 'Lowers blood glucose by up to 22%' },
                            { emoji: '🏋️', name: 'Resistance Training', duration: '3 sets × 15', benefit: 'Improves insulin sensitivity for 24–48h' },
                        ],
                        'obesity': [
                            { emoji: '🔥', name: 'Burpees', duration: '3 sets × 10', benefit: 'Burns fat 50% faster than typical cardio' },
                            { emoji: '💃', name: 'Dance / Zumba', duration: '20 min', benefit: 'Burns 350–650 kcal/hr, reduces cortisol' },
                        ],
                        'respiratory': [
                            { emoji: '🫁', name: 'Diaphragmatic Breathing', duration: '10 deep breaths', benefit: 'Strengthens diaphragm, +30% lung capacity' },
                            { emoji: '🚶‍♂️', name: 'Brisk Walking', duration: '30 minutes', benefit: 'Improves lung capacity & heart health' },
                        ],
                        'hypertension': [
                            { emoji: '🧘', name: 'Yoga for BP', duration: '20 minutes', benefit: 'Activates parasympathetic system, lowers BP' },
                            { emoji: '🌬️', name: 'Slow Breathing (4-6)', duration: '10 breaths', benefit: 'Lowers BP by up to 10 mmHg in 10 min' },
                        ],
                        'heart': [
                            { emoji: '❤️', name: 'Cardiac Walking', duration: '25 minutes', benefit: 'Strengthens heart without dangerous strain' },
                            { emoji: '💓', name: 'Chair Yoga', duration: '15 minutes', benefit: 'Improves heart rate variability safely' },
                        ],
                        'arthritis': [
                            { emoji: '🏊', name: 'Water Aerobics', duration: '30 minutes', benefit: '75% weight support, pain-free exercise' },
                            { emoji: '🤸', name: 'Range-of-Motion Stretching', duration: '10-15 per joint', benefit: 'Reduces stiffness by 40%' },
                        ],
                        'stress': [
                            { emoji: '🧠', name: 'Mindfulness Meditation', duration: '10-15 minutes', benefit: 'Reduces cortisol by up to 23%' },
                            { emoji: '🌿', name: 'Restorative Yoga', duration: '20 minutes', benefit: 'Activates vagus nerve, lowers cortisol' },
                        ],
                        'back': [
                            { emoji: '🐈', name: 'Cat-Cow Stretch', duration: '10 breaths × 3', benefit: 'Reduces lumbar disc pressure' },
                            { emoji: '🦅', name: 'Bird-Dog Exercise', duration: '10 each side × 3', benefit: 'Builds deep spine stabilizer muscles' },
                        ],
                        'pcos': [
                            { emoji: '⚡', name: 'HIIT for PCOS', duration: '4 rounds', benefit: 'Regulates insulin, reduces testosterone' },
                            { emoji: '🌸', name: 'Yoga for PCOS', duration: '25 minutes', benefit: 'Balances hormones, reduces cortisol' },
                        ],
                        'thyroid': [
                            { emoji: '🦋', name: 'Aerobic Exercise', duration: '30 minutes', benefit: 'Boosts T3/T4 conversion, reduces fatigue' },
                            { emoji: '🧘‍♀️', name: 'Thyroid Yoga', duration: '30-60 seconds', benefit: 'Increases blood flow to thyroid gland' },
                        ],
                        'cholesterol': [
                            { emoji: '🏃', name: 'Jogging', duration: '30 minutes', benefit: 'Raises HDL by 5-10%, reduces LDL' },
                            { emoji: '🏊', name: 'Swimming', duration: '30-45 minutes', benefit: 'Lowers LDL as effectively as jogging' },
                        ],
                        'kidney': [
                            { emoji: '🚶', name: 'Gentle Walking', duration: '20 minutes', benefit: 'Improves blood flow without strain' },
                            { emoji: '🧘', name: 'Gentle Stretching', duration: '15 minutes', benefit: 'Reduces muscle stiffness and fatigue' },
                        ],
                    };

                    data.detected_tags.forEach(tag => {
                        if (PRESET_EXERCISES[tag]) {
                            exercises = exercises.concat(PRESET_EXERCISES[tag]);
                        }
                    });
                } else if (data.ai_advice && data.ai_advice.exercises) {
                    badgeText = '🤖 AI Generated';
                    exercises = data.ai_advice.exercises.map(ex => ({
                        emoji: ex.emoji || '🏃',
                        name: ex.name,
                        duration: ex.duration,
                        benefit: ex.benefit
                    }));
                } else {
                    badgeText = '💪 General Plan';
                    exercises = [
                        { emoji: '🚶', name: 'Brisk Walking', duration: '30 min daily', benefit: 'Improves circulation and overall health' },
                        { emoji: '🫁', name: 'Deep Breathing', duration: '10 min daily', benefit: 'Reduces stress, improves oxygen delivery' },
                        { emoji: '🤸', name: 'Full-Body Stretching', duration: '15 min daily', benefit: 'Maintains flexibility, reduces stiffness' },
                        { emoji: '🧘', name: 'Yoga / Meditation', duration: '20 min daily', benefit: 'Balances mind and body, reduces cortisol' },
                    ];
                }

                if (badge) badge.textContent = badgeText;

                // Limit to 6 max
                exercises = exercises.slice(0, 6);

                safeSet(grid, 'innerHTML', '');
                exercises.forEach(ex => {
                    const card = document.createElement('div');
                    card.style.cssText = 'background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1rem; display: flex; gap: 0.8rem; align-items: flex-start; transition: transform 0.2s, border-color 0.3s; cursor: pointer;';
                    card.onmouseenter = () => { card.style.transform = 'translateY(-2px)'; card.style.borderColor = 'rgba(168,85,247,0.35)'; };
                    card.onmouseleave = () => { card.style.transform = 'translateY(0)'; card.style.borderColor = 'rgba(255,255,255,0.07)'; };

                    card.innerHTML = `
                        <div style="font-size: 1.8rem; flex-shrink: 0;">${ex.emoji}</div>
                        <div>
                            <div style="font-weight: 800; font-size: 0.92rem; margin-bottom: 0.2rem;">${ex.name}</div>
                            <div style="font-size: 0.72rem; color: var(--primary); margin-bottom: 0.3rem;">⏱ ${ex.duration}</div>
                            <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">${ex.benefit}</p>
                        </div>
                    `;
                    grid.appendChild(card);
                });
            })
            .catch(() => {
                const badge = document.getElementById('ai-rec-badge');
                if (badge) badge.textContent = 'Login to get recommendations';
            });
    }

    // Quick AI Coach on homepage
    const quickAIBtn = document.getElementById('quick-ai-btn');
    const quickAIInput = document.getElementById('quick-ai-input');
    const quickAIResponse = document.getElementById('quick-ai-response');

    if (quickAIBtn && quickAIInput) {
        quickAIBtn.addEventListener('click', async () => {
            const msg = quickAIInput.value.trim();
            if (!msg) {
                safeStyle(quickAIInput, 'borderColor', 'rgba(248,113,113,0.5)');
                setTimeout(() => quickAIInput.style.borderColor = '', 2000);
                return;
            }
            safeSet(quickAIBtn, 'disabled', true);
            safeSet(quickAIBtn, 'textContent', '⏳...');
            if (quickAIResponse) quickAIResponse.textContent = 'Thinking...';

            try {
                const res = await fetch('/api/workout_ai_guide', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: msg })
                });
                const data = await res.json();
                let html = `<div style="background: rgba(0,240,255,0.06); border: 1px solid rgba(0,240,255,0.18); border-left: 3px solid var(--primary); border-radius: 12px; padding: 0.8rem 1rem; margin-bottom: 0.6rem;">${data.reply || ''}</div>`;
                if (data.exercises && data.exercises.length > 0) {
                    html += '<div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem;">';
                    data.exercises.forEach(ex => {
                        html += `<span style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.2); border-radius: 10px; padding: 0.3rem 0.6rem; font-size: 0.78rem; font-weight: 600;">${ex.emoji || '🏃'} ${ex.name}</span>`;
                    });
                    html += '</div>';
                }
                if (data.tip) {
                    html += `<p style="margin-top: 0.5rem; font-size: 0.82rem; color: #3fb950;">💡 ${data.tip}</p>`;
                }
                if (quickAIResponse) quickAIResponse.innerHTML = html;
            } catch {
                if (quickAIResponse) quickAIResponse.textContent = 'Could not connect to AI. Please try again.';
            } finally {
                safeSet(quickAIBtn, 'disabled', false);
                safeSet(quickAIBtn, 'textContent', '✨ Ask');
            }
        });

        quickAIInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') quickAIBtn.click();
        });
    }

    // Load AI panel data
    loadDashboardWorkoutStats();
    loadAIRecommendations();
});

function showToast(message, type='info') {
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        safeStyle(toast, 'cssText', 'position:fixed; top:20px; left:50%; transform:translateX(-50%); padding:12px 20px; border-radius:8px; z-index:9999; color:white; font-weight:bold; box-shadow:0 4px 12px rgba(0,0,0,0.5); cursor:pointer; min-width:250px; text-align:center; transition: opacity 0.3s;');
        document.body.appendChild(toast);
        toast.addEventListener('click', () => { toast.style.display = 'none'; });
    }
    safeStyle(toast, 'display', 'block');
    safeStyle(toast, 'opacity', '1');
    safeSet(toast, 'textContent', message);
    safeStyle(toast, 'background', (type === 'error') ? 'var(--danger, #ff0055)' : 'var(--primary, #00f0ff)');
    safeStyle(toast, 'color', (type === 'error') ? '#fff' : '#000');
    setTimeout(() => { 
        safeStyle(toast, 'opacity', '0');
        setTimeout(() => { toast.style.display = 'none'; }, 300); 
    }, 3000);
}
