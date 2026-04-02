from flask import Flask, render_template, request, jsonify, session, g
import re
import sys
import sqlite3
import random
import os
import json
from datetime import date, timedelta
import google.generativeai as genai
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

# Restarting server to apply .env
load_dotenv() # Load variables from .env file

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fallback-dev-key-change-in-prod')

# Try to configure Gemini if key exists
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

DATABASE = os.environ.get('DATABASE_PATH', 'digital_twin.db')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        db.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        db.execute('''
            CREATE TABLE IF NOT EXISTS health_data (
                user_id INTEGER PRIMARY KEY,
                age REAL,
                sleep REAL,
                exercise REAL,
                height REAL,
                weight REAL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        
        db.execute('''
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id INTEGER PRIMARY KEY,
                location TEXT,
                gender TEXT,
                activity_level TEXT,
                goals TEXT,
                medical_conditions TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        
        db.execute('''
            CREATE TABLE IF NOT EXISTS nutrition_data (
                user_id INTEGER PRIMARY KEY,
                daily_total TEXT,
                meals TEXT,
                saved_date TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        # Add saved_date column if it doesn't exist (migration)
        try:
            db.execute('ALTER TABLE nutrition_data ADD COLUMN saved_date TEXT')
        except Exception:
            pass
        # Backfill saved_date = today for existing rows that don't have it yet
        # This ensures existing data is NOT wiped on the first load after migration
        db.execute(
            "UPDATE nutrition_data SET saved_date = ? WHERE saved_date IS NULL",
            (str(date.today()),)
        )
        db.execute('''
            CREATE TABLE IF NOT EXISTS daily_snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                vitality_score REAL,
                diet_score REAL,
                sleep_hours REAL,
                bmi REAL,
                heart_risk REAL,
                diabetes_risk REAL,
                obesity_risk REAL,
                bmi_category TEXT,
                remark TEXT,
                UNIQUE(user_id, date),
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        db.execute('''
            CREATE TABLE IF NOT EXISTS workout_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                calories_burned REAL DEFAULT 0,
                exercises_done INTEGER DEFAULT 0,
                done_ids TEXT DEFAULT '[]',
                UNIQUE(user_id, date),
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        db.execute('''
            CREATE TABLE IF NOT EXISTS nutrition_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                daily_total TEXT,
                UNIQUE(user_id, date),
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')
        db.commit()

@app.route('/')
def home():
    user = None
    if 'user_id' in session:
        db = get_db()
        user_row = db.execute('SELECT name, email FROM users WHERE id = ?', (session['user_id'],)).fetchone()
        if user_row:
            user = {'name': user_row['name'], 'email': user_row['email']}
    return render_template('index.html', user=user)

@app.route('/register', methods=['POST'])
def register():
    if not request.is_json:
        return jsonify({'error': 'JSON required'}), 415
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not email or not password or not name:
        return jsonify({'error': 'Name, Email and Password required'}), 400
    
    db = get_db()
    try:
        db.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
                   (name, email, generate_password_hash(password)))
        db.commit()
        return jsonify({'message': 'Registration successful'}), 200
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 400

@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({'error': 'JSON required'}), 415
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    if user and check_password_hash(user['password'], password):
        session['user_id'] = user['id']
        return jsonify({'message': 'Login successful'}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out'})

@app.route('/get_data', methods=['GET'])
def get_data():
    if 'user_id' in session:
        db = get_db()
        data = db.execute('SELECT age, sleep, exercise, height, weight FROM health_data WHERE user_id = ?', (session['user_id'],)).fetchone()
        if data:
            return jsonify(dict(data)), 200
    return jsonify({}), 200

@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({'error': 'JSON required'}), 415
    data = request.json
    try:
        age    = float(data.get('age', 30))
        height = float(data.get('height', 170))
        weight = float(data.get('weight', 70))
        # Sleep/exercise kept for backward compatibility but made optional
        sleep    = float(data.get('sleep', 7))
        exercise = float(data.get('exercise', 3))
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid inputs'}), 400

    if 'user_id' in session:
        db = get_db()
        db.execute('INSERT OR REPLACE INTO health_data (user_id, age, sleep, exercise, height, weight) VALUES (?, ?, ?, ?, ?, ?)',
                   (session['user_id'], age, sleep, exercise, height, weight))
        db.commit()

    # ── BMI ──────────────────────────────────────────────
    bmi = weight / ((height / 100.0) ** 2) if height > 0 else 25

    # ── Personalized nutrition targets (Harris-Benedict) ──
    bmr  = 10 * weight + 6.25 * height - 5 * age + 5
    tdee = bmr * 1.375   # lightly active baseline
    target_protein  = weight * 0.8          # g
    target_carbs    = (tdee * 0.50) / 4     # g
    target_fiber    = 21 if age > 50 else 28 # g
    target_calories = tdee

    # ── Fetch today's actual nutrition from DB ────────────
    diet_score = 50  # neutral default if no data
    if 'user_id' in session:
        db = get_db()
        row = db.execute('SELECT daily_total FROM nutrition_data WHERE user_id = ?',
                         (session['user_id'],)).fetchone()
        if row and row['daily_total']:
            try:
                dt = json.loads(row['daily_total'])
                eaten_protein  = float(dt.get('protein', 0))
                eaten_carbs    = float(dt.get('carbs', 0))
                eaten_fiber    = float(dt.get('fiber', 0))
                eaten_cals     = float(dt.get('calories', 0))

                def macro_ratio(eaten, target):
                    if target <= 0: return 0
                    r = eaten / target
                    if r <= 1.0:
                        return r * 25
                    return max(0, 25 - (r - 1) * 30)

                raw = (macro_ratio(eaten_protein, target_protein) +
                       macro_ratio(eaten_carbs,   target_carbs)   +
                       macro_ratio(eaten_fiber,   target_fiber)   +
                       macro_ratio(eaten_cals,    target_calories))
                diet_score = raw
            except Exception:
                pass

    # ── Sleep quality calculation ─────────────────────────
    # Optimal = 7-9h. Penalty for under/over sleeping.
    def sleep_factor(s):
        if 7 <= s <= 9:   return 0        # ideal, no penalty
        if s < 7:         return (7 - s) * 7   # e.g. 5h -> +14 penalty
        return (s - 9) * 4                 # oversleep -> smaller penalty

    sleep_penalty = sleep_factor(sleep)    # always >= 0

    # ── Exercise factor ──────────────────────────────────
    # exercise is in minutes/day: 0-120
    # More exercise = reduces all risks
    def exercise_benefit(mins):
        if mins <= 0: return 0
        if mins <= 30: return mins * 0.4
        if mins <= 60: return 12 + (mins - 30) * 0.25
        return 19.5 + (mins - 60) * 0.1

    exercise_bonus = exercise_benefit(exercise)

    # ── Risk calculations (diet + sleep + exercise aware) ─
    bmi_penalty  = max(0, (bmi - 24) * 3)
    age_factor   = (age / 100) * 35

    # Diet quality bonus/penalty (-15 to +15)
    diet_bonus   = (diet_score - 50) * 0.3

    heart_disease = max(2, min(98, age_factor + bmi_penalty * 0.8 + sleep_penalty * 0.9 + 15 - diet_bonus - exercise_bonus * 0.5))
    diabetes      = max(2, min(98, age_factor + bmi_penalty * 1.5 + sleep_penalty * 0.7 + 10 - diet_bonus * 1.2 - exercise_bonus * 0.4))
    obesity       = max(2, min(98, 5 + (bmi - 18) * 4 + sleep_penalty * 0.5 - diet_bonus * 0.8 - exercise_bonus * 0.6))

    # ── Vitality score (real-world capped) ───────────────
    risk_component  = heart_disease * 0.35 + diabetes * 0.30 + obesity * 0.25
    diet_component  = diet_score * 0.10
    sleep_component = max(0, 10 - sleep_penalty * 0.5)
    exercise_component = min(8, exercise_bonus * 0.3)

    raw_score = 100 - risk_component + diet_component + sleep_component + exercise_component

    # Real-world ceiling: biological aging reduces max achievable score
    # A 20-yr-old can hit 94%, a 60-yr-old peaks ~78% even with perfect habits
    age_ceiling = max(72, 96 - (age - 18) * 0.38)

    # Environmental & stress friction (constant 3% baseline reality gap)
    reality_friction = 3.0

    health_score = max(8, min(age_ceiling - reality_friction, raw_score))

    # ── BMI Category ─────────────────────────────────────
    if bmi < 18.5:
        bmi_category = "Underweight"
    elif bmi < 25:
        bmi_category = "Normal Weight"
    elif bmi < 30:
        bmi_category = "Overweight"
    else:
        bmi_category = "Obese"

    # ── Diet plan (kept for reference) ───────────────────
    ai_diet = []


    if bmi_category == "Underweight":
        ai_diet = [
            {"time": "6:00 AM - 11:00 AM", "meal": "Breakfast", "food": "Protein Shake, 2 Eggs, Avocado Toast, Oatmeal with Nuts"},
            {"time": "11:00 AM - 3:00 PM", "meal": "Lunch", "food": "Grilled Chicken Breast, Quinoa, Sweet Potatoes, Dense Green Salad"},
            {"time": "4:00 PM - 6:00 PM", "meal": "Snacks", "food": "Greek Yogurt with Honey, Almonds, Banana, Peanut Butter"},
            {"time": "7:00 PM - 11:00 PM", "meal": "Dinner", "food": "Salmon, Brown Rice, Steamed Broccoli"},
            {"time": "11:00 PM onwards", "meal": "Sleep", "food": "Optimal rest for muscle synthesis and recovery"}
        ]
    elif bmi_category == "Overweight" or bmi_category == "Obese":
        ai_diet = [
            {"time": "6:00 AM - 11:00 AM", "meal": "Breakfast", "food": "Green Tea, 2 Boiled Egg Whites, Oatmeal with Berries"},
            {"time": "11:00 AM - 3:00 PM", "meal": "Lunch", "food": "Grilled Turkey/Chicken, mixed vegetables, light vinaigrette"},
            {"time": "4:00 PM - 6:00 PM", "meal": "Snacks", "food": "Apple slices, small handful of Walnuts, or Celery Sticks"},
            {"time": "7:00 PM - 11:00 PM", "meal": "Dinner", "food": "Baked White Fish, Asparagus, Spinach salad"},
            {"time": "11:00 PM onwards", "meal": "Sleep", "food": "Fast overnight to activate fat burn and maximize autophagy"}
        ]
    else:
        ai_diet = [
            {"time": "6:00 AM - 11:00 AM", "meal": "Breakfast", "food": "Scrambled Eggs, Whole Wheat Toast, Fresh Fruit Bowl"},
            {"time": "11:00 AM - 3:00 PM", "meal": "Lunch", "food": "Lean Beef or Chicken Wrap, Side Salad, Mixed Veggies"},
            {"time": "4:00 PM - 6:00 PM", "meal": "Snacks", "food": "Protein Bar, Mixed Berries, or Yogurt"},
            {"time": "7:00 PM - 11:00 PM", "meal": "Dinner", "food": "Chicken or Tofu Stir-fry with vegetables & Brown Rice"},
            {"time": "11:00 PM onwards", "meal": "Sleep", "food": "Rest and restore daily energy"}
        ]
    
    return jsonify({
        'heart_disease': round(heart_disease, 1),
        'diabetes': round(diabetes, 1),
        'obesity': round(obesity, 1),
        'health_score': round(max(0, min(100, health_score)), 1),
        'bmi': round(bmi, 1),
        'bmi_category': bmi_category,
        'ai_diet': ai_diet
    })


@app.route('/api/snapshot', methods=['POST'])
def save_snapshot():
    """Called by frontend to save today's daily snapshot after /predict."""
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    if not request.is_json:
        return jsonify({'error': 'JSON required'}), 415
    data = request.json

    # Support saving as yesterday (for logging last night's sleep)
    if data.get('date_override') == 'yesterday':
        target_date = str(date.today() - timedelta(days=1))
    else:
        target_date = str(date.today())

    db = get_db()

    vitality = round(float(data.get('vitality_score', 0)), 1)
    diet_sc   = round(float(data.get('diet_score', 0)), 1)
    sleep_h   = round(float(data.get('sleep_hours', 7)), 1)
    bmi_val   = round(float(data.get('bmi', 0)), 1)
    heart     = round(float(data.get('heart_risk', 0)), 1)
    diab      = round(float(data.get('diabetes_risk', 0)), 1)
    obese     = round(float(data.get('obesity_risk', 0)), 1)
    bmi_cat   = data.get('bmi_category', '')

    # Generate auto-remark
    if vitality >= 85:   remark = '🌟 Excellent health day!'
    elif vitality >= 72: remark = '✅ Good day overall.'
    elif vitality >= 58: remark = '⚠️ Average — room to improve.'
    elif vitality >= 42: remark = '😟 Below average day.'
    else:                remark = '❌ Poor health indicators today.'

    if diet_sc < 40:  remark += ' Low diet quality.'
    if sleep_h < 6:   remark += ' Insufficient sleep.'
    if sleep_h >= 7 and sleep_h <= 9: remark += ' Great sleep!'
    if bmi_val > 27:  remark += ' BMI above optimal range.'


    db.execute('''
        INSERT INTO daily_snapshots
            (user_id, date, vitality_score, diet_score, sleep_hours, bmi, heart_risk, diabetes_risk, obesity_risk, bmi_category, remark)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(user_id, date) DO UPDATE SET
            vitality_score=excluded.vitality_score,
            diet_score=excluded.diet_score,
            sleep_hours=excluded.sleep_hours,
            bmi=excluded.bmi,
            heart_risk=excluded.heart_risk,
            diabetes_risk=excluded.diabetes_risk,
            obesity_risk=excluded.obesity_risk,
            bmi_category=excluded.bmi_category,
            remark=excluded.remark
    ''', (session['user_id'], target_date, vitality, diet_sc, sleep_h, bmi_val, heart, diab, obese, bmi_cat, remark))
    db.commit()
    return jsonify({'saved': True, 'date': target_date, 'remark': remark})



@app.route('/api/history', methods=['GET'])
def get_history():
    """Returns last 7 daily snapshots for the logged-in user."""
    if 'user_id' not in session:
        return jsonify([]), 401
    db = get_db()
    rows = db.execute('''
        SELECT date, vitality_score, diet_score, sleep_hours, bmi, bmi_category,
               heart_risk, diabetes_risk, obesity_risk, remark
        FROM daily_snapshots
        WHERE user_id = ?
        ORDER BY date DESC
        LIMIT 7
    ''', (session['user_id'],)).fetchall()
    return jsonify([dict(r) for r in rows])

@app.route('/api/nutrition', methods=['GET', 'POST'])
def nutrition_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    today = str(date.today())
    db = get_db()

    if request.method == 'GET':
        row = db.execute('SELECT daily_total, meals, saved_date FROM nutrition_data WHERE user_id = ?', (session['user_id'],)).fetchone()
        if row:
            # If data is from a previous day, auto-reset it
            if row['saved_date'] != today:
                db.execute('''
                    UPDATE nutrition_data SET
                        daily_total = ?,
                        meals = ?,
                        saved_date = ?
                    WHERE user_id = ?
                ''', (json.dumps({}), json.dumps({}), today, session['user_id']))
                db.commit()
                return jsonify(None)  # Fresh day — no data
            return jsonify({
                'dailyTotal': json.loads(row['daily_total']),
                'meals': json.loads(row['meals'])
            })
        return jsonify(None)
        
    elif request.method == 'POST':
        if not request.is_json:
            return jsonify({'error': 'JSON required'}), 415
        data = request.json
        daily_total = json.dumps(data.get('dailyTotal', {}))
        meals = json.dumps(data.get('meals', {}))
        
        db.execute('''
            INSERT INTO nutrition_data (user_id, daily_total, meals, saved_date) 
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET 
                daily_total=excluded.daily_total, 
                meals=excluded.meals,
                saved_date=excluded.saved_date
        ''', (session['user_id'], daily_total, meals, today))

        # Also save to nutrition_history for multi-day analysis
        db.execute('''
            INSERT INTO nutrition_history (user_id, date, daily_total)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id, date) DO UPDATE SET daily_total=excluded.daily_total
        ''', (session['user_id'], today, daily_total))

        db.commit()
        return jsonify({'message': 'Saved successfully'})


@app.route('/api/nutrition_analysis', methods=['GET'])
def nutrition_analysis():
    """Returns aggregated nutrition data for a given time range."""
    if 'user_id' not in session:
        return jsonify({'carbs': 0, 'protein': 0, 'fiber': 0, 'calories': 0, 'days': 1}), 200

    range_type = request.args.get('range', 'daily')
    today = date.today()

    if range_type == '7days':
        start_date = str(today - timedelta(days=7))
        days = 7
    elif range_type == '10days':
        start_date = str(today - timedelta(days=10))
        days = 10
    elif range_type == '30days':
        start_date = str(today - timedelta(days=30))
        days = 30
    else:
        # Daily — just return current nutrition_data
        db = get_db()
        row = db.execute('SELECT daily_total FROM nutrition_data WHERE user_id = ?', (session['user_id'],)).fetchone()
        if row and row['daily_total']:
            try:
                dt = json.loads(row['daily_total'])
                return jsonify({
                    'carbs': float(dt.get('carbs', 0)),
                    'protein': float(dt.get('protein', 0)),
                    'fiber': float(dt.get('fiber', 0)),
                    'calories': float(dt.get('calories', 0)),
                    'days': 1,
                    'logged_days': 1
                })
            except:
                pass
        return jsonify({'carbs': 0, 'protein': 0, 'fiber': 0, 'calories': 0, 'days': 1, 'logged_days': 0})

    # Multi-day range
    db = get_db()
    rows = db.execute('''
        SELECT daily_total FROM nutrition_history 
        WHERE user_id = ? AND date >= ?
        ORDER BY date DESC
    ''', (session['user_id'], start_date)).fetchall()

    total_carbs = 0
    total_protein = 0
    total_fiber = 0
    total_calories = 0
    logged_days = 0

    for row in rows:
        try:
            dt = json.loads(row['daily_total'])
            c = float(dt.get('carbs', 0))
            p = float(dt.get('protein', 0))
            f = float(dt.get('fiber', 0))
            cal = float(dt.get('calories', 0))
            if c + p + f + cal > 0:
                total_carbs += c
                total_protein += p
                total_fiber += f
                total_calories += cal
                logged_days += 1
        except:
            continue

    return jsonify({
        'carbs': round(total_carbs, 1),
        'protein': round(total_protein, 1),
        'fiber': round(total_fiber, 1),
        'calories': round(total_calories, 1),
        'days': days,
        'logged_days': logged_days
    })


@app.route('/api/sleep_log_status', methods=['GET'])
def sleep_log_status():
    """Returns whether the user has already logged sleep today."""
    if 'user_id' not in session:
        return jsonify({'logged': False})
    today = str(date.today())
    db = get_db()
    # Check if yesterday's snapshot exists (sleep is always saved as yesterday)
    yesterday = str(date.today() - timedelta(days=1))
    row = db.execute(
        'SELECT id FROM daily_snapshots WHERE user_id = ? AND date = ?',
        (session['user_id'], yesterday)
    ).fetchone()
    # Also check if the user logged today's date (in case they logged same day)
    row_today = db.execute(
        'SELECT id FROM daily_snapshots WHERE user_id = ? AND date = ?',
        (session['user_id'], today)
    ).fetchone()
    return jsonify({'logged': row is not None or row_today is not None, 'yesterday': yesterday, 'today': today})

@app.route('/api/workout_log', methods=['GET', 'POST'])
def workout_log():
    """GET: return today's log + last 7 days history. POST: save today's progress."""
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    db = get_db()
    uid = session['user_id']
    today = str(date.today())

    if request.method == 'POST':
        if not request.is_json:
            return jsonify({'error': 'JSON required'}), 415
        data = request.json or {}
        calories  = float(data.get('calories_burned', 0))
        ex_done   = int(data.get('exercises_done', 0))
        done_ids  = json.dumps(data.get('done_ids', []))

        db.execute('''
            INSERT INTO workout_logs (user_id, date, calories_burned, exercises_done, done_ids)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id, date) DO UPDATE SET
                calories_burned = excluded.calories_burned,
                exercises_done  = excluded.exercises_done,
                done_ids        = excluded.done_ids
        ''', (uid, today, calories, ex_done, done_ids))
        db.commit()
        return jsonify({'status': 'saved', 'date': today,
                        'calories_burned': calories, 'exercises_done': ex_done})

    # GET — return today's log + 7-day history
    today_row = db.execute(
        'SELECT * FROM workout_logs WHERE user_id=? AND date=?', (uid, today)
    ).fetchone()

    history = db.execute(
        '''SELECT date, calories_burned, exercises_done FROM workout_logs
           WHERE user_id=? ORDER BY date DESC LIMIT 7''', (uid,)
    ).fetchall()

    today_data = None
    if today_row:
        today_data = {
            'date': today_row['date'],
            'calories_burned': today_row['calories_burned'],
            'exercises_done':  today_row['exercises_done'],
            'done_ids': json.loads(today_row['done_ids'] or '[]')
        }

    history_data = [
        {'date': r['date'], 'calories_burned': r['calories_burned'],
         'exercises_done': r['exercises_done']}
        for r in history
    ]

    return jsonify({'today': today_data, 'history': history_data})


@app.route('/api/workout_recommendations', methods=['GET'])
def workout_recommendations():
    """Read user's medical conditions and return matching workout tags + Gemini advice."""
    if 'user_id' not in session:
        return jsonify({'conditions_text': '', 'detected_tags': [], 'ai_advice': None})

    db = get_db()
    profile = db.execute(
        'SELECT medical_conditions FROM user_profiles WHERE user_id = ?',
        (session['user_id'],)
    ).fetchone()

    if not profile or not profile['medical_conditions']:
        return jsonify({'conditions_text': '', 'detected_tags': [], 'ai_advice': None})

    raw = profile['medical_conditions'].strip()
    ctext = raw.lower().strip()

    # ── Extended skip-word set (catches typos like 'nill', 'nulll', etc.) ──
    SKIP_WORDS = {
        'none', 'nil', 'nill', 'null', 'no', 'nah', 'na', 'n/a', 'n.a.',
        '-', '--', '---', 'nothing', 'no condition', 'no conditions',
        'healthy', 'normal', 'fine', 'ok', 'okay', 'good', 'no disease',
        'not applicable', 'not any', 'no issue', 'no issues', 'none.',
    }
    if ctext in SKIP_WORDS or len(ctext) <= 2:
        return jsonify({'conditions_text': raw, 'detected_tags': [], 'ai_advice': None})

    # ── Keyword → internal tag mapping ─────────────────────────────────────
    CONDITION_MAP = [
        (['diabetes', 'prediabetes', 'diabetic', 'blood sugar', 'insulin resistance',
          'type 1', 'type 2', 't2dm', 't1dm'], 'diabetes'),
        (['obesity', 'overweight', 'weight gain', 'high bmi', 'morbid obesity'], 'obesity'),
        (['asthma', 'copd', 'bronchitis', 'breathlessness', 'emphysema',
          'respiratory', 'breathing difficulty', 'wheez'], 'respiratory'),
        (['hypertension', 'high blood pressure', 'blood pressure', 'high bp',
          'elevated bp', 'stage 1 hyper', 'stage 2 hyper'], 'hypertension'),
        (['heart disease', 'cardiac', 'coronary', 'cardiovascular', 'angina',
          'heart failure', 'heart attack', 'myocardial', 'artery disease'], 'heart'),
        (['arthritis', 'joint pain', 'rheumatoid', 'osteoarthritis', 'knee pain',
          'gout', 'joint stiffness'], 'arthritis'),
        (['stress', 'anxiety', 'depression', 'mental health', 'panic disorder',
          'insomnia', 'sleep disorder', 'ptsd', 'ocd'], 'stress'),
        (['back pain', 'lower back', 'spine', 'lumbar', 'sciatica',
          'herniated disc', 'spondylitis', 'backache'], 'back'),
        (['cholesterol', 'high ldl', 'lipid', 'triglycerides', 'dyslipidemia'], 'cholesterol'),
        (['pcos', 'pcod', 'polycystic ovary', 'hormonal imbalance', 'irregular periods'], 'pcos'),
        (['thyroid', 'hypothyroid', 'hyperthyroid', 'hashimoto', 'goitre'], 'thyroid'),
        (['kidney', 'renal', 'ckd', 'kidney disease', 'nephropathy'], 'kidney'),
    ]

    detected_tags = []
    for keywords, tag in CONDITION_MAP:
        for kw in keywords:
            if kw in ctext:
                if tag not in detected_tags:
                    detected_tags.append(tag)
                break

    # ── If no known condition matched → call Gemini for a custom plan ──────
    ai_advice = None
    if not detected_tags:
        if GEMINI_API_KEY:
            try:
                model = genai.GenerativeModel('gemini-2.5-flash')
                prompt = f"""You are a certified fitness and wellness coach.

A user's health profile says their medical condition is: "{raw}"

Task: Suggest exactly 3 specific daily exercises that help prevent worsening or manage this condition.

Return ONLY valid JSON (no markdown, no extra text, no code fences):
{{
  "condition_label": "Friendly name for this condition (e.g. Migraine, Liver Disease)",
  "exercises": [
    {{
      "name": "Exact exercise name",
      "emoji": "relevant emoji",
      "duration": "e.g. 20 minutes or 3 sets of 10",
      "benefit": "One clear sentence explaining exactly how this helps the condition."
    }},
    {{
      "name": "Second exercise",
      "emoji": "emoji",
      "duration": "duration",
      "benefit": "benefit"
    }},
    {{
      "name": "Third exercise",
      "emoji": "emoji",
      "duration": "duration",
      "benefit": "benefit"
    }}
  ]
}}"""
                resp = model.generate_content(prompt)
                raw_text = resp.text.strip()

                # Strip markdown code fences if present
                raw_text = re.sub(r'^```(?:json)?\s*', '', raw_text, flags=re.MULTILINE)
                raw_text = re.sub(r'\s*```$', '', raw_text, flags=re.MULTILINE)
                raw_text = raw_text.strip()

                ai_advice = json.loads(raw_text)
                # Basic validation
                if 'exercises' not in ai_advice or not isinstance(ai_advice['exercises'], list):
                    ai_advice = None
            except Exception as e:
                print(f"[Gemini workout_recommendations] error: {e}")
                ai_advice = None
        
        # If Gemini also failed, build a generic fallback so page is never empty
        if ai_advice is None:
            ai_advice = {
                "condition_label": raw,
                "exercises": [
                    {"name": "Brisk Walking", "emoji": "🚶", "duration": "30 minutes daily",
                     "benefit": "Low-impact aerobic activity that improves circulation and overall health for most conditions."},
                    {"name": "Deep Breathing / Pranayama", "emoji": "🫁", "duration": "10 minutes daily",
                     "benefit": "Reduces stress hormones, improves oxygen delivery, and calms the nervous system."},
                    {"name": "Gentle Full-Body Stretching", "emoji": "🤸", "duration": "15 minutes daily",
                     "benefit": "Maintains flexibility, reduces stiffness, and supports joint and muscle health."},
                ]
            }

    return jsonify({
        'conditions_text': raw,
        'detected_tags': detected_tags,
        'ai_advice': ai_advice
    })


@app.route('/api/workout_ai_guide', methods=['POST'])
def workout_ai_guide():
    """AI coach: user describes their condition/confusion, returns structured workout advice."""
    if not request.is_json:
        return jsonify({'error': 'JSON required'}), 415
    data = request.json or {}
    user_msg = data.get('message', '').strip()

    if not user_msg:
        return jsonify({'error': 'No message provided'}), 400

    if not GEMINI_API_KEY:
        return jsonify({'error': 'AI unavailable'}), 503

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f"""You are FitTwin AI — a friendly certified fitness coach inside a health app.

A user wrote: "{user_msg}"

They may be confused about what exercises to do, or they have a specific condition/goal.
Give them a clear, encouraging, actionable workout recommendation.

Return ONLY valid JSON (no markdown, no code fences):
{{
  "reply": "A warm 2-3 sentence conversational answer acknowledging their situation.",
  "plan_title": "Short title for their plan (e.g. 'Your 7-Day Starter Plan')",
  "exercises": [
    {{
      "name": "Exercise name",
      "emoji": "emoji",
      "duration": "duration/reps",
      "benefit": "Why this is good for them specifically."
    }}
  ],
  "tip": "One final motivational closing tip."
}}

Include 3-5 exercises. Keep language simple and supportive."""
        resp = model.generate_content(prompt)
        raw_text = resp.text.strip()

        raw_text = re.sub(r'^```(?:json)?\s*', '', raw_text, flags=re.MULTILINE)
        raw_text = re.sub(r'\s*```$', '', raw_text, flags=re.MULTILINE)

        result = json.loads(raw_text.strip())
        return jsonify(result)

    except Exception as e:
        print(f"[Gemini workout_ai_guide] error: {e}")
        return jsonify({
            'reply': "I'm here to help! Based on your message, here's a safe starter plan you can try today.",
            'plan_title': 'Safe Starter Workout Plan',
            'exercises': [
                {'name': 'Brisk Walking', 'emoji': '🚶', 'duration': '30 min daily', 'benefit': 'Improves cardio health and mood.'},
                {'name': 'Bodyweight Squats', 'emoji': '🦵', 'duration': '3 sets × 15', 'benefit': 'Strengthens legs and improves metabolism.'},
                {'name': 'Deep Breathing', 'emoji': '🫁', 'duration': '10 min daily', 'benefit': 'Reduces stress and improves oxygen flow.'},
            ],
            'tip': 'Start slow and be consistent — even 15 minutes a day makes a big difference! 💪'
        }), 200




@app.route('/api/profile', methods=['GET', 'POST'])
def profile_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    db = get_db()
    if request.method == 'GET':
        row = db.execute('SELECT * FROM user_profiles WHERE user_id = ?', (session['user_id'],)).fetchone()
        if row:
            return jsonify(dict(row))
        return jsonify(None)
        
    elif request.method == 'POST':
        if not request.is_json:
            return jsonify({'error': 'JSON required'}), 415
        data = request.json
        location = data.get('location', '')
        gender = data.get('gender', '')
        activity_level = data.get('activity_level', '')
        goals = json.dumps(data.get('goals', []))
        medical_conditions = data.get('medical_conditions', '')
        age = float(data.get('age', 30))
        height = float(data.get('height', 170))
        weight = float(data.get('weight', 70))
        
        # Save to user_profiles
        db.execute('''
            INSERT INTO user_profiles (user_id, location, gender, activity_level, goals, medical_conditions) 
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET 
                location=excluded.location, gender=excluded.gender,
                activity_level=excluded.activity_level, goals=excluded.goals,
                medical_conditions=excluded.medical_conditions
        ''', (session['user_id'], location, gender, activity_level, goals, medical_conditions))
        
        # Also sync to health_data for the twin sliders
        db.execute('''
            INSERT INTO health_data (user_id, age, sleep, exercise, height, weight) 
            VALUES (?, ?, 7, 3, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET 
                age=excluded.age, height=excluded.height, weight=excluded.weight
        ''', (session['user_id'], age, height, weight))
        
        db.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
        
@app.route('/api/coach_chat', methods=['POST'])
def coach_chat():
    if not request.is_json:
        return jsonify({'error': 'JSON required'}), 415
    data = request.json
    message = data.get('message', '')
    context = data.get('context', {})
    
    # Check if API key is configured
    if not GEMINI_API_KEY:
        return jsonify({
            'reply': "⚠️ The Gemini API Key is missing! Please provide your API key to the AI assistant to activate my true intelligence."
        })
        
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        You are 'NutriSmart AI', an elite certified nutritionist, doctor, and health coach.
        You are talking directly to a user in a health tracking dashboard.
        
        USER CONTEXT:
        - Age: {context.get('age', 'Unknown')}
        - Weight: {context.get('weight', 'Unknown')} kg
        - Height: {context.get('height', 'Unknown')} cm
        - Activity Level: {context.get('activity', 'Unknown')}
        - Current BMI Category: {context.get('bmiCategory', 'Unknown')}
        
        Their message: "{message}"
        
        RULES:
        - Keep answers concise, friendly, and under 4 sentences if possible.
        - Act directly as the coach. Provide hyper-personalized advice based on their BMI and activity.
        - Be highly professional yet enthusiastic.
        """
        
        response = model.generate_content(prompt)
        return jsonify({'reply': response.text})
    except Exception as e:
        return jsonify({'reply': f"Error connecting to Gemini: {str(e)}"}), 500

@app.route('/api/detect_food', methods=['POST'])
def detect_food():
    if not GEMINI_API_KEY:
        return jsonify({'error': 'Gemini API Key missing.'}), 400
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    ALLOWED_MIMETYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}
    if file.mimetype not in ALLOWED_MIMETYPES:
        return jsonify({'error': 'Only JPEG, PNG, WebP, or GIF images are allowed.'}), 400
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = """
        You are an expert AI food analyzer. Analyze this image of food.
        Identify the primary dish/item. Estimate its nutritional values per standard serving.
        Respond ONLY with a valid JSON strictly following this schema:
        {
            "name": "Name of Food",
            "qty": 1,
            "unit": "Plate/Bowl/Item/100g",
            "carbs": float (in grams),
            "protein": float (in grams),
            "fiber": float (in grams),
            "calories": float (in kcal)
        }
        Do not use markdown code blocks, return raw text containing just the JSON dictionary. Do not prefix with ```json or anything else. Just the { object }.
        """
        image_part = {"mime_type": file.mimetype or "image/jpeg", "data": file.read()}
        
        response = model.generate_content([prompt, image_part])
        text = response.text.strip()
        
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        data = json.loads(text.strip())
        data["name"] = data.get("name", "Unknown Food") + " (AI Detected)"
        
        return jsonify({'detectedItem': data})
        
    except Exception as e:
        print(f"Error in Vision: {e}")
        return jsonify({'error': f"Failed to analyze image: {str(e)}"}), 500

@app.route('/workout')
def workout():
    user = None
    if 'user_id' in session:
        db = get_db()
        user_row = db.execute('SELECT name, email FROM users WHERE id = ?', (session['user_id'],)).fetchone()
        if user_row:
            user = {'name': user_row['name'], 'email': user_row['email']}
    return render_template('workout.html', user=user)

@app.route('/tracker')
def tracker():
    user = None
    if 'user_id' in session:
        db = get_db()
        user_row = db.execute('SELECT name, email FROM users WHERE id = ?', (session['user_id'],)).fetchone()
        if user_row:
            user = {'name': user_row['name'], 'email': user_row['email']}
    return render_template('tracker.html', user=user)

def create_app():
    init_db()
    return app

# For local dev
if __name__ == '__main__':
    init_db()
    print("Starting AI Health Digital Twin Server...", flush=True)
    print("Access the interface locally at: http://127.0.0.1:5001", flush=True)
    app.run(host='0.0.0.0', debug=False, port=5001)
