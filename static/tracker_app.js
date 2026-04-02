// --- Mock DB: Food Data ---
const mockFoodDatabase = [
    // ===== BREAKFAST =====
    { id: 1, name: 'Oats with Milk', category: 'Breakfast', carbs: 30, protein: 12, fiber: 5, unit: '100g' },
    { id: 2, name: 'Boiled Egg', category: 'Breakfast', carbs: 0.6, protein: 6, fiber: 0, unit: 'item' },
    { id: 3, name: 'Poha', category: 'Breakfast', carbs: 35, protein: 5, fiber: 3, unit: '100g' },
    { id: 4, name: 'Upma', category: 'Breakfast', carbs: 35, protein: 6, fiber: 3, unit: '100g' },
    { id: 5, name: 'Idli', category: 'Breakfast', carbs: 28, protein: 4, fiber: 2, unit: 'item' },
    { id: 6, name: 'Dosa', category: 'Breakfast', carbs: 30, protein: 5, fiber: 3, unit: 'item' },
    { id: 7, name: 'Thepla', category: 'Breakfast', carbs: 35, protein: 6, fiber: 4, unit: 'item' },
    { id: 8, name: 'Dhokla', category: 'Breakfast', carbs: 25, protein: 6, fiber: 2, unit: '100g' },
    { id: 9, name: 'Bread Butter', category: 'Breakfast', carbs: 30, protein: 4, fiber: 2, unit: '100g' },
    { id: 10, name: 'Bread Jam', category: 'Breakfast', carbs: 35, protein: 3, fiber: 1, unit: '100g' },
    { id: 11, name: 'Toast & Peanut Butter', category: 'Breakfast', carbs: 28, protein: 8, fiber: 3, unit: '100g' },
    { id: 12, name: 'Sandwich Veg', category: 'Breakfast', carbs: 40, protein: 6, fiber: 4, unit: 'item' },
    { id: 13, name: 'Boiled Eggs (2)', category: 'Breakfast', carbs: 2, protein: 12, fiber: 0, unit: 'serving' },
    { id: 14, name: 'Egg Bhurji', category: 'Breakfast', carbs: 5, protein: 14, fiber: 1, unit: '100g' },
    { id: 15, name: 'Omelette', category: 'Breakfast', carbs: 3, protein: 13, fiber: 0, unit: 'item' },
    { id: 16, name: 'Egg Sandwich', category: 'Breakfast', carbs: 35, protein: 12, fiber: 3, unit: 'item' },
    { id: 17, name: 'Chicken Keema', category: 'Breakfast', carbs: 10, protein: 20, fiber: 2, unit: '100g' },
    { id: 18, name: 'Chicken Sandwich', category: 'Breakfast', carbs: 40, protein: 15, fiber: 3, unit: 'item' },
    { id: 19, name: 'Puttu + Kadala', category: 'Breakfast', carbs: 35, protein: 8, fiber: 5, unit: '100g' },
    { id: 20, name: 'Appam + Stew', category: 'Breakfast', carbs: 30, protein: 6, fiber: 2, unit: '100g' },
    { id: 21, name: 'Pesarattu', category: 'Breakfast', carbs: 22, protein: 9, fiber: 4, unit: 'item' },
    { id: 22, name: 'Ragi Dosa', category: 'Breakfast', carbs: 28, protein: 5, fiber: 5, unit: 'item' },
    { id: 23, name: 'Chuda Dahi', category: 'Breakfast', carbs: 38, protein: 7, fiber: 2, unit: '100g' },
    { id: 24, name: 'Ghugni', category: 'Breakfast', carbs: 30, protein: 9, fiber: 6, unit: '100g' },
    { id: 25, name: 'Idiyappam', category: 'Breakfast', carbs: 30, protein: 2, fiber: 1, unit: '100g' },
    { id: 26, name: 'Aloo Paratha', category: 'Breakfast', carbs: 45, protein: 7, fiber: 5, unit: 'item' },
    { id: 27, name: 'Chole Bhature', category: 'Breakfast', carbs: 50, protein: 12, fiber: 7, unit: '100g' },
    { id: 28, name: 'Sabudana Khichdi', category: 'Breakfast', carbs: 40, protein: 3, fiber: 2, unit: '100g' },
    { id: 29, name: 'Bedmi Puri', category: 'Breakfast', carbs: 48, protein: 8, fiber: 4, unit: '100g' },
    { id: 30, name: 'Luchi Aloo', category: 'Breakfast', carbs: 45, protein: 6, fiber: 3, unit: '100g' },
    { id: 31, name: 'Fafda Jalebi', category: 'Breakfast', carbs: 60, protein: 8, fiber: 2, unit: '100g' },
    { id: 32, name: 'Bamboo Shoot Curry + Rice', category: 'Breakfast', carbs: 40, protein: 5, fiber: 4, unit: '100g' },
    { id: 33, name: 'Pitha', category: 'Breakfast', carbs: 30, protein: 3, fiber: 2, unit: 'item' },
    { id: 34, name: 'Ragi Mudde', category: 'Breakfast', carbs: 40, protein: 6, fiber: 5, unit: '100g' },
    { id: 35, name: 'Appam', category: 'Breakfast', carbs: 30, protein: 3, fiber: 2, unit: 'item' },
    { id: 36, name: 'Puttu', category: 'Breakfast', carbs: 33, protein: 4, fiber: 3, unit: '100g' },
    { id: 37, name: 'Kadala Curry', category: 'Breakfast', carbs: 20, protein: 8, fiber: 6, unit: '100g' },

    // ===== LUNCH =====
    { id: 40, name: 'Roti / Chapati', category: 'Lunch', carbs: 20, protein: 3, fiber: 2, unit: 'item' },
    { id: 41, name: 'Steamed Rice', category: 'Lunch', carbs: 45, protein: 4, fiber: 1, unit: '100g' },
    { id: 42, name: 'Paratha', category: 'Lunch', carbs: 40, protein: 6, fiber: 3, unit: 'item' },
    { id: 43, name: 'Jeera Rice', category: 'Lunch', carbs: 48, protein: 4, fiber: 1, unit: '100g' },
    { id: 44, name: 'Dal Tadka', category: 'Lunch', carbs: 25, protein: 9, fiber: 5, unit: '100g' },
    { id: 45, name: 'Rajma Curry', category: 'Lunch', carbs: 30, protein: 10, fiber: 6, unit: '100g' },
    { id: 46, name: 'Chole', category: 'Lunch', carbs: 35, protein: 11, fiber: 7, unit: '100g' },
    { id: 47, name: 'Sambar', category: 'Lunch', carbs: 20, protein: 7, fiber: 4, unit: '100g' },
    { id: 48, name: 'Avial', category: 'Lunch', carbs: 18, protein: 4, fiber: 5, unit: '100g' },
    { id: 49, name: 'Baingan Bharta', category: 'Lunch', carbs: 15, protein: 3, fiber: 4, unit: '100g' },
    { id: 50, name: 'Chicken Curry', category: 'Lunch', carbs: 10, protein: 20, fiber: 2, unit: '100g' },
    { id: 51, name: 'Mutton Curry', category: 'Lunch', carbs: 8, protein: 22, fiber: 1, unit: '100g' },
    { id: 52, name: 'Fish Curry', category: 'Lunch', carbs: 5, protein: 18, fiber: 1, unit: '100g' },
    { id: 53, name: 'Vegetable Pulao', category: 'Lunch', carbs: 50, protein: 7, fiber: 4, unit: '100g' },
    { id: 54, name: 'Chicken Biryani', category: 'Lunch', carbs: 60, protein: 20, fiber: 3, unit: '100g' },
    { id: 55, name: 'Mutton Biryani', category: 'Lunch', carbs: 65, protein: 22, fiber: 2, unit: '100g' },
    { id: 56, name: 'Curd Rice', category: 'Lunch', carbs: 40, protein: 6, fiber: 2, unit: '100g' },
    { id: 57, name: 'Lemon Rice', category: 'Lunch', carbs: 45, protein: 5, fiber: 2, unit: '100g' },
    { id: 58, name: 'Sarson da Saag + Makki Roti', category: 'Lunch', carbs: 35, protein: 8, fiber: 6, unit: '100g' },
    { id: 59, name: 'Bamboo Shoot Pork', category: 'Lunch', carbs: 15, protein: 18, fiber: 3, unit: '100g' },
    { id: 60, name: 'Kadhi Pakora', category: 'Lunch', carbs: 30, protein: 8, fiber: 3, unit: '100g' },
    { id: 61, name: 'Undhiyu', category: 'Lunch', carbs: 25, protein: 6, fiber: 7, unit: '100g' },
    { id: 62, name: 'Pakhala Bhata', category: 'Lunch', carbs: 40, protein: 4, fiber: 1, unit: '100g' },
    { id: 63, name: 'Mixed Veggies', category: 'Lunch', carbs: 12, protein: 2, fiber: 5, unit: '100g' },
    { id: 64, name: 'Dal (Lentils)', category: 'Lunch', carbs: 20, protein: 9, fiber: 8, unit: '100g' },

    // ===== SNACKS =====
    { id: 70, name: 'Samosa', category: 'Snacks', carbs: 30, protein: 5, fiber: 3, unit: 'item' },
    { id: 71, name: 'Pakora', category: 'Snacks', carbs: 25, protein: 6, fiber: 2, unit: '100g' },
    { id: 72, name: 'Vada Pav', category: 'Snacks', carbs: 40, protein: 7, fiber: 4, unit: 'item' },
    { id: 73, name: 'Pani Puri', category: 'Snacks', carbs: 35, protein: 4, fiber: 3, unit: 'serving' },
    { id: 74, name: 'Bhel Puri', category: 'Snacks', carbs: 30, protein: 5, fiber: 4, unit: '100g' },
    { id: 75, name: 'Sev Puri', category: 'Snacks', carbs: 32, protein: 4, fiber: 3, unit: '100g' },
    { id: 76, name: 'Medu Vada', category: 'Snacks', carbs: 20, protein: 6, fiber: 3, unit: 'item' },
    { id: 77, name: 'Murukku', category: 'Snacks', carbs: 35, protein: 5, fiber: 2, unit: '100g' },
    { id: 78, name: 'Banana Chips', category: 'Snacks', carbs: 40, protein: 2, fiber: 3, unit: '100g' },
    { id: 79, name: 'Aloo Tikki', category: 'Snacks', carbs: 28, protein: 4, fiber: 3, unit: 'item' },
    { id: 80, name: 'Chole Kulche', category: 'Snacks', carbs: 45, protein: 10, fiber: 6, unit: '100g' },
    { id: 81, name: 'Kachori', category: 'Snacks', carbs: 50, protein: 6, fiber: 3, unit: 'item' },
    { id: 82, name: 'Fafda', category: 'Snacks', carbs: 38, protein: 7, fiber: 2, unit: '100g' },
    { id: 83, name: 'Thepla Chips', category: 'Snacks', carbs: 30, protein: 5, fiber: 3, unit: '100g' },
    { id: 84, name: 'Chicken Pakora', category: 'Snacks', carbs: 15, protein: 18, fiber: 1, unit: '100g' },
    { id: 85, name: 'Chicken 65', category: 'Snacks', carbs: 10, protein: 20, fiber: 1, unit: '100g' },
    { id: 86, name: 'Egg Roll', category: 'Snacks', carbs: 35, protein: 12, fiber: 3, unit: 'item' },
    { id: 87, name: 'Roasted Chana', category: 'Snacks', carbs: 20, protein: 6, fiber: 5, unit: '100g' },
    { id: 88, name: 'Peanuts', category: 'Snacks', carbs: 16, protein: 7, fiber: 3, unit: '100g' },
    { id: 89, name: 'Sprouts Salad', category: 'Snacks', carbs: 18, protein: 8, fiber: 6, unit: '100g' },
    { id: 90, name: 'Almonds', category: 'Snacks', carbs: 21, protein: 21, fiber: 12, unit: '100g' },
    { id: 91, name: 'Apple', category: 'Snacks', carbs: 14, protein: 0.3, fiber: 2.4, unit: 'item' },
    { id: 92, name: 'Dhokla', category: 'Snacks', carbs: 25, protein: 6, fiber: 2, unit: '100g' },

    // ===== DINNER =====
    { id: 100, name: 'Paneer Tikka', category: 'Dinner', carbs: 8, protein: 14, fiber: 1, unit: '100g' },
    { id: 101, name: 'Salad (Cucumber/Tomato)', category: 'Dinner', carbs: 4, protein: 1, fiber: 2, unit: '100g' },
    { id: 102, name: 'Khichdi', category: 'Dinner', carbs: 25, protein: 6, fiber: 3, unit: '100g' },
    { id: 103, name: 'Fish Fry', category: 'Dinner', carbs: 8, protein: 18, fiber: 1, unit: '100g' },
    { id: 104, name: 'Roti', category: 'Dinner', carbs: 20, protein: 3, fiber: 2, unit: 'item' },
    { id: 105, name: 'Dal Tadka', category: 'Dinner', carbs: 25, protein: 9, fiber: 5, unit: '100g' },
    { id: 106, name: 'Rajma Curry', category: 'Dinner', carbs: 30, protein: 10, fiber: 6, unit: '100g' },
    { id: 107, name: 'Chicken Curry', category: 'Dinner', carbs: 10, protein: 20, fiber: 2, unit: '100g' },
    { id: 108, name: 'Mutton Curry', category: 'Dinner', carbs: 8, protein: 22, fiber: 1, unit: '100g' },
    { id: 109, name: 'Fish Curry', category: 'Dinner', carbs: 5, protein: 18, fiber: 1, unit: '100g' },
    { id: 110, name: 'Chicken Biryani', category: 'Dinner', carbs: 60, protein: 20, fiber: 3, unit: '100g' },
    { id: 111, name: 'Mutton Biryani', category: 'Dinner', carbs: 65, protein: 22, fiber: 2, unit: '100g' },
    { id: 112, name: 'Curd Rice', category: 'Dinner', carbs: 40, protein: 6, fiber: 2, unit: '100g' },
    { id: 113, name: 'Vegetable Pulao', category: 'Dinner', carbs: 50, protein: 7, fiber: 4, unit: '100g' },
    { id: 114, name: 'Kadhi Pakora', category: 'Dinner', carbs: 30, protein: 8, fiber: 3, unit: '100g' },
    { id: 115, name: 'Sarson da Saag + Makki Roti', category: 'Dinner', carbs: 35, protein: 8, fiber: 6, unit: '100g' },
    { id: 116, name: 'Baingan Bharta', category: 'Dinner', carbs: 15, protein: 3, fiber: 4, unit: '100g' },
    { id: 117, name: 'Sambar', category: 'Dinner', carbs: 20, protein: 7, fiber: 4, unit: '100g' },
    { id: 118, name: 'Undhiyu', category: 'Dinner', carbs: 25, protein: 6, fiber: 7, unit: '100g' },
];


// --- App State ---
const state = {
    dailyTarget: {
        carbs: 275, // 250-300g avg
        protein: 60, // 50-70g avg
        fiber: 30 // 25-35g avg
    },
    dailyTotal: {
        carbs: 0,
        protein: 0,
        fiber: 0,
        calories: 0
    },
    meals: {
        Breakfast: { status: 'pending', items: [] },
        Lunch: { status: 'pending', items: [] },
        Snacks: { status: 'pending', items: [] },
        Dinner: { status: 'pending', items: [] }
    },
    currentEntryItems: [],
    notifications: []
};

// Meal Rules
const mealRules = {
    Breakfast: { start: 6, end: 11 },
    Lunch: { start: 12, end: 15 },
    Snacks: { start: 16, end: 18 },
    Dinner: { start: 19, end: 23 }
};

// --- DOM Elements ---
const navLinks = document.querySelectorAll('.nav-links li');
const views = document.querySelectorAll('.view');
const timeDisplay = document.getElementById('current-time');
const mealWindowDisplay = document.getElementById('current-meal-window');

// Dashboard Elements
const carbTotalEl = document.getElementById('total-carbs');
const proTotalEl = document.getElementById('total-protein');
const fibTotalEl = document.getElementById('total-fiber');
const calTotalEl = document.getElementById('total-calories');
const carbProgEl = document.getElementById('carbs-progress');
const proProgEl = document.getElementById('protein-progress');
const fibProgEl = document.getElementById('fiber-progress');
const mealTimelineEl = document.getElementById('meal-timeline');
const insightsContainerEl = document.getElementById('insights-container');

// Form Elements
const searchInp = document.getElementById('food-search');
const dropdownEl = document.getElementById('food-dropdown');
const qtyInp = document.getElementById('food-qty');
const unitSelect = document.getElementById('food-unit');
const addFoodBtn = document.getElementById('add-food-btn');
const currentListEl = document.getElementById('current-items-list');
const submitMealBtn = document.getElementById('submit-meal-btn');
const mealTypeSelect = document.getElementById('meal-type');

// Summary Form Elements
const entCarb = document.getElementById('entry-carbs');
const entPro = document.getElementById('entry-protein');
const entFib = document.getElementById('entry-fiber');
const entCal = document.getElementById('entry-calories');

// DB Table
const tbody = document.querySelector('#food-table tbody');

// Init
function init() {
    setupNavigation();
    updateClock();
    setInterval(updateClock, 1000); // 1s
    setInterval(checkMealWindows, 60000); // 1m check
    populateDatabase();
    setupFoodSearch();
    renderTimeline();
    updateDashboard();
    checkMealWindows();
    setupAnalysisTabs();

    // Fetch synced data from backend if logged in
    fetch('/api/nutrition?t=' + new Date().getTime())
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Not logged in or no data');
        })
        .then(data => {
            if (data && data.dailyTotal) {
                // Restore daily totals
                state.dailyTotal = {
                    carbs:    parseFloat(data.dailyTotal.carbs    || 0),
                    protein:  parseFloat(data.dailyTotal.protein  || 0),
                    fiber:    parseFloat(data.dailyTotal.fiber    || 0),
                    calories: parseFloat(data.dailyTotal.calories || 0)
                };

                // Restore meals (items + status) from server
                if (data.meals) {
                    ['Breakfast', 'Lunch', 'Snacks', 'Dinner'].forEach(meal => {
                        if (data.meals[meal]) {
                            state.meals[meal].items  = data.meals[meal].items  || [];
                            state.meals[meal].status = data.meals[meal].status || 'pending';
                        }
                    });
                }

                renderTimeline();
                updateDashboard();

                if (mealTypeSelect.value) {
                    mealTypeSelect.dispatchEvent(new Event('change'));
                }
            }
        })
        .catch(err => {
            console.error(err);
            showToast('Something went wrong. Please try again.', 'error');
        });

    mealTypeSelect.addEventListener('change', (e) => {
        const meal = e.target.value;
        if (meal && state.meals[meal] && state.meals[meal].status === 'completed') {
            state.currentEntryItems = [...state.meals[meal].items];
            updateCurrentEntryList();
            submitMealBtn.disabled = false;
        } else {
            state.currentEntryItems = [];
            updateCurrentEntryList();
        }
    });

    addFoodBtn.addEventListener('click', addFoodToEntry);
    submitMealBtn.addEventListener('click', saveMealEntry);
    
    document.getElementById('noti-btn').addEventListener('click', () => {
        document.getElementById('noti-dropdown').classList.toggle('hidden');
    });

    // AI Vision Feature
    setupAISnap();
}

function setupAISnap() {
    const aiSnapLabel = document.getElementById('ai-snap-label');
    const aiSnapInput = document.getElementById('ai-snap-input');
    const aiSnapOverlay = document.getElementById('ai-snap-overlay');
    const aiPreviewContainer = document.getElementById('ai-snap-preview-container');
    const aiPreviewImg = document.getElementById('ai-snap-preview');
    const aiConfirmBtn = document.getElementById('ai-snap-confirm');
    const aiCancelBtn = document.getElementById('ai-snap-cancel');
    const mealTypeSelect = document.getElementById('meal-type');
    
    if(!document.getElementById('ai-snap-styles')){
        const style = document.createElement('style');
        style.id = 'ai-snap-styles';
        style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }

    if (aiSnapLabel && aiSnapInput) {
        aiSnapLabel.addEventListener('click', (e) => {
            if (!mealTypeSelect || !mealTypeSelect.value) {
                e.preventDefault();
                showToast("Please select a meal type first (e.g., Breakfast)!");
            }
        });

        aiSnapInput.addEventListener('change', (e) => {
            if(e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function(evt) {
                    aiPreviewImg.src = evt.target.result;
                    aiPreviewContainer.style.display = 'block';
                    aiSnapLabel.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });

        aiCancelBtn.addEventListener('click', () => {
            aiSnapInput.value = '';
            aiPreviewContainer.style.display = 'none';
            aiSnapLabel.style.display = 'inline-block';
            aiPreviewImg.src = '';
        });

        aiConfirmBtn.addEventListener('click', () => {
            const formData = new FormData();
            formData.append('image', aiSnapInput.files[0]);
            aiSnapOverlay.style.display = 'flex';
            
            fetch('/api/detect_food', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                aiSnapOverlay.style.display = 'none';
                if(data.error) {
                    showToast(data.error);
                } else {
                    state.currentEntryItems.push(data.detectedItem);
                    updateCurrentEntryList();
                    showToast(`Gemini detected: ${data.detectedItem.name} (${data.detectedItem.calories} kcal)`);
                    document.getElementById('submit-meal-btn').disabled = false;
                    // Reset UI
                    aiCancelBtn.click(); 
                }
            })
            .catch(err => {
                aiSnapOverlay.style.display = 'none';
                showToast("Failed to connect to Gemini AI");
            });
        });
    }
}

// Navigation
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetView = e.currentTarget.getAttribute('data-tab');
            if(!targetView) return; // Handle Digital Twin back button

            navLinks.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active-view'));
            
            e.currentTarget.classList.add('active');
            document.getElementById(targetView).classList.add('active-view');

            if(targetView === 'analysis') {
                loadAnalysisData(currentRange);
            }
        });
    });
}

// Clock & Meal Windows
function updateClock() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

function checkMealWindows() {
    const hour = new Date().getHours();
    let currentWindow = 'None';
    
    // Check Meal Window status
    for (const [meal, time] of Object.entries(mealRules)) {
        if (hour >= time.start && hour < time.end) {
            currentWindow = `${meal} (${time.start}:00 - ${time.end}:00)`;
            
            // Notification logic (1 hour before ends)
            if (hour === time.end - 1 && state.meals[meal].status === 'pending') {
                addNotification(`Reminder: 1 hour left to log your ${meal}!`);
            }
        } else if (hour >= time.end && state.meals[meal].status === 'pending') {
            // Mark skipped
            state.meals[meal].status = 'skipped';
            addNotification(`You skipped ${meal} today.`);
            renderTimeline();
        }
    }
    mealWindowDisplay.textContent = `Window: ${currentWindow}`;
}

// Notifications
function addNotification(msg) {
    if(!state.notifications.includes(msg)) {
        state.notifications.push(msg);
        const list = document.getElementById('noti-list');
        if(state.notifications.length === 1) list.innerHTML = '';
        const li = document.createElement('li');
        li.textContent = msg;
        list.appendChild(li);
        
        const badge = document.getElementById('noti-badge');
        badge.textContent = state.notifications.length;
        badge.classList.remove('hidden');
        showToast(msg);
    }
}

// Food DB Population
function populateDatabase() {
    mockFoodDatabase.forEach(food => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${food.name}</td>
            <td><span class="status-badge">${food.category}</span></td>
            <td>${food.carbs}</td>
            <td>${food.protein}</td>
            <td>${food.fiber}</td>
            <td>${food.unit}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Form Search Logic
let selectedFood = null;

function setupFoodSearch() {
    searchInp.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        dropdownEl.innerHTML = '';
        if (val.length < 2) {
            dropdownEl.classList.add('hidden');
            return;
        }

        const matches = mockFoodDatabase.filter(f => f.name.toLowerCase().includes(val));
        if (matches.length > 0) {
            matches.forEach(food => {
                const div = document.createElement('div');
                div.className = 'food-item';
                div.innerHTML = `<strong>${food.name}</strong> <small>${food.carbs}g C | ${food.protein}g P | ${food.fiber}g F per ${food.unit}</small>`;
                div.addEventListener('click', () => {
                    selectedFood = food;
                    searchInp.value = food.name;
                    unitSelect.value = food.unit === 'item' ? 'item' : '100g';
                    dropdownEl.classList.add('hidden');
                });
                dropdownEl.appendChild(div);
            });
            dropdownEl.classList.remove('hidden');
        } else {
            dropdownEl.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.flex-grow')) {
            dropdownEl.classList.add('hidden');
        }
    });
}

// Adding Food to Entry
function addFoodToEntry() {
    if (!selectedFood) {
        showToast("Please select a food from the dropdown.");
        return;
    }
    const qty = parseFloat(qtyInp.value) || 1;
    let multiplier = 1;

    if (selectedFood.unit === '100g' && (unitSelect.value === '100g' || unitSelect.value === 'g')) {
        // If 1 is entered, it means 1 portion of 100g (multiplier = 1)
        multiplier = qty;
    } else if (selectedFood.unit === 'item' && unitSelect.value === 'item') {
        multiplier = qty;
    } else {
        showToast("Check unit matching.");
        return;
    }

    const itemC = parseFloat((selectedFood.carbs * multiplier).toFixed(1));
    const itemP = parseFloat((selectedFood.protein * multiplier).toFixed(1));
    const itemF = parseFloat((selectedFood.fiber * multiplier).toFixed(1));
    const itemCal = parseFloat(((itemC * 4) + (itemP * 4)).toFixed(1)); // Approximation

    const entry = {
        name: selectedFood.name,
        qty: qty,
        unit: unitSelect.value,
        carbs: itemC,
        protein: itemP,
        fiber: itemF,
        calories: itemCal
    };

    state.currentEntryItems.push(entry);
    updateCurrentEntryList();
    
    // Reset inputs
    searchInp.value = '';
    selectedFood = null;
    qtyInp.value = '1';
    submitMealBtn.disabled = false;
}

function updateCurrentEntryList() {
    currentListEl.innerHTML = '';
    let tC = 0, tP = 0, tF = 0, tCal = 0;

    if (state.currentEntryItems.length === 0) {
        currentListEl.innerHTML = '<li class="empty-list">No items added yet.</li>';
        submitMealBtn.disabled = true;
    }

    state.currentEntryItems.forEach((item, index) => {
        tC += item.carbs; tP += item.protein; tF += item.fiber; tCal += item.calories;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.unit === '100g' ? item.qty * 100 : item.qty}${item.unit === '100g' ? 'g' : 'x'} ${item.name}</span>
            <span>
                <small>${item.carbs}C | ${item.protein}P | ${item.calories}kcal</small>
                <span class="remove-item" onclick="removeEntryItem(${index})">X</span>
            </span>
        `;
        currentListEl.appendChild(li);
    });

    entCarb.textContent = tC.toFixed(1);
    entPro.textContent = tP.toFixed(1);
    entFib.textContent = tF.toFixed(1);
    entCal.textContent = tCal.toFixed(1);
}

window.removeEntryItem = function(index) {
    state.currentEntryItems.splice(index, 1);
    updateCurrentEntryList();
};

// Saving Meal Entry
function saveMealEntry() {
    const meal = mealTypeSelect.value;
    if (!meal) {
        showToast("Please select meal type!");
        return;
    }
    
    if(state.meals[meal].status === 'completed') {
        showToast(`You have already logged ${meal}. Overwriting...`);
        // Remove previous values from daily total
        const prevItems = state.meals[meal].items;
        prevItems.forEach(i => {
            state.dailyTotal.carbs -= i.carbs;
            state.dailyTotal.protein -= i.protein;
            state.dailyTotal.fiber -= i.fiber;
            state.dailyTotal.calories -= i.calories;
        });
    }

    state.meals[meal].items = [...state.currentEntryItems];
    state.meals[meal].status = 'completed';

    // Add to daily total
    state.currentEntryItems.forEach(i => {
        state.dailyTotal.carbs += i.carbs;
        state.dailyTotal.protein += i.protein;
        state.dailyTotal.fiber += i.fiber;
        state.dailyTotal.calories += i.calories;
    });

    state.currentEntryItems = [];
    updateCurrentEntryList();
    renderTimeline();
    updateDashboard();
    showToast(`${meal} Saved Successfully!`);
    
    // Sync with backend
    fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyTotal: state.dailyTotal, meals: state.meals })
    }).catch(err => {
        console.error(err);
        showToast('Something went wrong. Please try again.', 'error');
    });
}

// Update Dashboard
function updateDashboard() {
    carbTotalEl.textContent = state.dailyTotal.carbs.toFixed(1);
    proTotalEl.textContent = state.dailyTotal.protein.toFixed(1);
    fibTotalEl.textContent = state.dailyTotal.fiber.toFixed(1);
    calTotalEl.textContent = state.dailyTotal.calories.toFixed(1);

    const cp = Math.min((state.dailyTotal.carbs / state.dailyTarget.carbs) * 100, 100);
    const pp = Math.min((state.dailyTotal.protein / state.dailyTarget.protein) * 100, 100);
    const fp = Math.min((state.dailyTotal.fiber / state.dailyTarget.fiber) * 100, 100);

    carbProgEl.style.width = cp + '%';
    proProgEl.style.width = pp + '%';
    fibProgEl.style.width = fp + '%';

    updateInsights();
}

// Timeline
function renderTimeline() {
    mealTimelineEl.innerHTML = '';
    ['Breakfast', 'Lunch', 'Snacks', 'Dinner'].forEach(meal => {
        const data = state.meals[meal];
        const statusClass = data.status === 'completed' ? 'completed' : data.status === 'skipped' ? 'skipped' : 'pending';
        let subText = data.status === 'completed' ? `${data.items.length} items logged` : 'Waiting for entry';
        if(data.status === 'skipped') subText = 'Missed Window';

        const div = document.createElement('div');
        div.className = `meal-item ${statusClass}`;
        div.innerHTML = `
            <div class="meal-info">
                <h4>${meal}</h4>
                <p>${subText}</p>
            </div>
            <div class="meal-status ${statusClass}">
                ${data.status}
            </div>
        `;
        mealTimelineEl.appendChild(div);
    });
}

// Health Insights (Core Logic)
function updateInsights() {
    insightsContainerEl.innerHTML = '';
    const insights = [];

    if (state.dailyTotal.carbs > state.dailyTarget.carbs) {
        insights.push({ type: 'warning', text: '📈 High Carbohydrate Intake. Increases risk of blood sugar spikes or weight gain.' });
    }
    
    if (state.dailyTotal.protein > 0 && state.dailyTotal.protein < state.dailyTarget.protein * 0.5) {
         insights.push({ type: 'warning', text: '📉 Low Protein Intake. Protein is essential for muscle repair.' });
    }

    if (state.dailyTotal.fiber > 0 && state.dailyTotal.fiber < state.dailyTarget.fiber * 0.5) {
         insights.push({ type: 'info', text: '📉 Low Fiber. Consider eating more vegetables to aid digestion.' });
    }

    // Check skipps
    let skips = 0;
    for(let m in state.meals) { if(state.meals[m].status === 'skipped') skips++; }
    if(skips > 0) {
        insights.push({ type: 'warning', text: `⚠️ ${skips} meal(s) skipped today. This reduces metabolic stability and analysis accuracy.` });
    }

    if (insights.length === 0 && state.dailyTotal.calories > 0) {
        insights.push({ type: 'good', text: '✨ You are on track! Macros are well balanced.' });
    } else if (state.dailyTotal.calories === 0) {
        insights.push({ type: 'info', text: '🍽️ Add meals to see health insights.' });
    }

    insights.forEach(ins => {
        const elm = document.createElement('div');
        elm.className = `insight-item ${ins.type}`;
        elm.textContent = ins.text;
        insightsContainerEl.appendChild(elm);
    });
}

// Daily Analysis Charts and Suggestions
let chartInstance = null;
let currentRange = 'daily';

function setupAnalysisTabs() {
    const tabs = document.querySelectorAll('.range-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.style.background = 'var(--surface-hover)';
                t.style.color = 'var(--text-primary)';
                t.classList.remove('active');
            });
            tab.style.background = 'var(--accent)';
            tab.style.color = 'white';
            tab.classList.add('active');
            currentRange = tab.dataset.range;

            const labelMap = {
                'daily': "Today's Report",
                '7days': 'Last 7 Days Summary',
                '10days': 'Last 10 Days Summary',
                '30days': 'Last 1 Month Summary'
            };
            const labelText = document.getElementById('range-label-text');
            if (labelText) labelText.textContent = labelMap[currentRange] || "Today's Report";

            loadAnalysisData(currentRange);
        });
    });
}

function loadAnalysisData(range) {
    fetch('/api/nutrition_analysis?range=' + range)
        .then(r => r.json())
        .then(data => {
            renderCharts(data);
            updateMacroPills(data);
            generateDailyInsights(data);
        })
        .catch(() => {
            // Fallback to local state for 'daily'
            const fallback = {
                carbs: state.dailyTotal.carbs,
                protein: state.dailyTotal.protein,
                fiber: state.dailyTotal.fiber,
                calories: state.dailyTotal.calories,
                days: 1
            };
            renderCharts(fallback);
            updateMacroPills(fallback);
            generateDailyInsights(fallback);
        });
}

function renderCharts(data) {
    const ctx = document.getElementById('macrosChart').getContext('2d');
    
    if(chartInstance) chartInstance.destroy();

    const carbs = data.carbs || state.dailyTotal.carbs;
    const protein = data.protein || state.dailyTotal.protein;
    const fiber = data.fiber || state.dailyTotal.fiber;
    const cals = data.calories || state.dailyTotal.calories;
    const fatEstimate = Math.max((cals / 9) - 10, 0);

    // Update center label
    const totalCalEl = document.getElementById('chart-total-cal');
    if (totalCalEl) totalCalEl.textContent = Math.round(cals);

    const hasData = carbs + protein + fiber > 0;

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: hasData ? ['Carbs', 'Protein', 'Fiber', 'Other/Fat Estimate'] : ['No data yet'],
            datasets: [{
                data: hasData ? [carbs, protein, fiber, fatEstimate] : [1],
                backgroundColor: hasData ? ['#58a6ff', '#3fb950', '#d2a8ff', '#30363d'] : ['rgba(255,255,255,0.08)'],
                borderWidth: 0,
                hoverOffset: hasData ? 12 : 0
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom', labels: { color: '#f0f6fc', font: { family: "'Outfit', sans-serif", size: 12 }, padding: 18 } },
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            if (!hasData) return 'No meals logged';
                            return `${ctx.label}: ${ctx.parsed.toFixed(1)}g`;
                        }
                    }
                }
            },
            cutout: '72%',
            animation: { animateRotate: true, duration: 800 }
        }
    });
}

function updateMacroPills(data) {
    const carbs = data.carbs || state.dailyTotal.carbs;
    const protein = data.protein || state.dailyTotal.protein;
    const fiber = data.fiber || state.dailyTotal.fiber;
    const cals = data.calories || state.dailyTotal.calories;
    const days = data.days || 1;

    const suffix = days > 1 ? ` (avg ${(carbs/days).toFixed(0)}g/d)` : '';
    const pSuffix = days > 1 ? ` (avg ${(protein/days).toFixed(0)}g/d)` : '';
    const fSuffix = days > 1 ? ` (avg ${(fiber/days).toFixed(0)}g/d)` : '';
    const cSuffix = days > 1 ? ` (avg ${Math.round(cals/days)}/d)` : '';

    const pillCarbs = document.getElementById('pill-carbs');
    const pillProtein = document.getElementById('pill-protein');
    const pillFiber = document.getElementById('pill-fiber');
    const pillCalories = document.getElementById('pill-calories');

    if (pillCarbs) pillCarbs.textContent = `${carbs.toFixed(1)}g${suffix}`;
    if (pillProtein) pillProtein.textContent = `${protein.toFixed(1)}g${pSuffix}`;
    if (pillFiber) pillFiber.textContent = `${fiber.toFixed(1)}g${fSuffix}`;
    if (pillCalories) pillCalories.textContent = `${Math.round(cals)} kcal${cSuffix}`;
}

function generateDailyInsights(data) {
    const assessBox = document.getElementById('risk-assessment');
    const suggestBox = document.getElementById('daily-suggestions');
    
    const carbs = data ? (data.carbs || state.dailyTotal.carbs) : state.dailyTotal.carbs;
    const protein = data ? (data.protein || state.dailyTotal.protein) : state.dailyTotal.protein;
    const fiber = data ? (data.fiber || state.dailyTotal.fiber) : state.dailyTotal.fiber;
    const cals = data ? (data.calories || state.dailyTotal.calories) : state.dailyTotal.calories;
    const days = (data && data.days) ? data.days : 1;

    const avgCarbs = days > 1 ? carbs / days : carbs;
    const avgProtein = days > 1 ? protein / days : protein;
    const avgFiber = days > 1 ? fiber / days : fiber;
    const avgCals = days > 1 ? cals / days : cals;

    let htmlAssess = '<h3>Health Risk Assessment</h3><br/>';
    
    if (avgCarbs > 350) {
        htmlAssess += '<div class="insight-item warning"><b>Diabetes/Metabolic Risk:</b> Elevated due to excessive carbs/sugar intake.</div>';
    } else if (avgCarbs > 0) {
        htmlAssess += '<div class="insight-item info"><b>Diabetes Risk:</b> Normal levels based on current tracking.</div>';
    }
    
    if (avgCals > 2500) {
        htmlAssess += '<br/><div class="insight-item warning"><b>Weight Gain Risk:</b> High caloric intake vs normal range. Ensure physical activity is adjusted.</div>';
    }

    if (avgProtein > 0 && avgProtein < 40) {
        htmlAssess += '<br/><div class="insight-item warning"><b>Protein Deficiency Risk:</b> Consistently low protein can lead to muscle loss and weakened immunity.</div>';
    }

    if (avgCals === 0) {
        htmlAssess += '<div class="insight-item info"><b>No Data:</b> No meals logged for this period. Start tracking to see risk analysis.</div>';
    }

    assessBox.innerHTML = htmlAssess;

    // Suggestions
    let htmlSuggest = '<h3>Smart Suggestions</h3><br/><ul>';
    let sugCount = 0;
    
    if (avgProtein < 50 && avgCals > 0) {
        htmlSuggest += '<li>\ud83e\udd69 <b>Increase Protein:</b> Try adding more <i>Dal, Paneer, or Eggs</i> to your meals.</li>';
        sugCount++;
    }
    if (avgCarbs > 280) {
        htmlSuggest += '<li>\ud83c\udf3e <b>Reduce Carbs:</b> Swap White Rice for <i>Brown Rice or Salads</i> to control blood sugar.</li>';
        sugCount++;
    }
    if (avgFiber < 25 && avgCals > 0) {
        htmlSuggest += '<li>\ud83e\udd57 <b>Add Fiber:</b> Include more <i>Salads, Almonds, or Oats</i> for better digestion.</li>';
        sugCount++;
    }

    if (days > 1 && avgCals > 0) {
        const consistency = data.logged_days || 0;
        if (consistency < days * 0.5) {
            htmlSuggest += `<li>⏰ <b>Tracking Consistency:</b> Only ${consistency}/${days} days tracked. Log every meal for accurate analysis.</li>`;
            sugCount++;
        }
    }
    
    let skips = 0;
    for(let m in state.meals) { if(state.meals[m].status === 'skipped') skips++; }
    if(skips > 0 && currentRange === 'daily') {
        htmlSuggest += '<li>⏰ <b>Better Tracking:</b> Try not to skip meals, missing entries affects your health data accuracy.</li>';
        sugCount++;
    }

    if(sugCount === 0) {
        htmlSuggest += '<li>\ud83c\udf1f Great job! Keep following the same healthy pattern.</li>';
    }
    htmlSuggest += '</ul>';
    
    suggestBox.innerHTML = htmlSuggest;
}

// Utils
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Start
document.addEventListener('DOMContentLoaded', init);
