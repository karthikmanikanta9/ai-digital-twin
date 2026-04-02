"""
Comprehensive Test Suite for AI Health Digital Twin
Covers: Auth, Pages, Predict, Nutrition, Analysis, Workout, Profile, Sleep, Coach
"""
import sys, os, json, unittest
sys.path.insert(0, os.path.dirname(__file__))

from app import app, init_db

class BaseTestCase(unittest.TestCase):
    """Base with fresh test client per test."""
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'test-key'
        self.client = app.test_client()

    # Helper: register + login, returns session-holding client
    def _auth(self, name='Test User', email='test@test.com', pw='pass123'):
        self.client.post('/register', json={'name': name, 'email': email, 'password': pw})
        self.client.post('/login', json={'email': email, 'password': pw})


# ═══════════════════════════════════════════════
# 1. PAGE ROUTES (GET)
# ═══════════════════════════════════════════════
class TestPageRoutes(BaseTestCase):
    """TC01-TC04: All pages return 200."""

    def test_tc01_home_page(self):
        r = self.client.get('/')
        self.assertEqual(r.status_code, 200)
        self.assertIn(b'Digital Twin', r.data)

    def test_tc02_tracker_page(self):
        r = self.client.get('/tracker')
        self.assertEqual(r.status_code, 200)
        self.assertIn(b'NutriSmart', r.data)

    def test_tc03_workout_page(self):
        r = self.client.get('/workout')
        self.assertEqual(r.status_code, 200)

    def test_tc04_home_shows_guest_when_not_logged_in(self):
        r = self.client.get('/')
        self.assertIn(b'Login', r.data)


# ═══════════════════════════════════════════════
# 2. AUTH (Register / Login / Logout)
# ═══════════════════════════════════════════════
class TestAuth(BaseTestCase):
    """TC05-TC11: Auth flows."""

    def test_tc05_register_success(self):
        r = self.client.post('/register', json={
            'name': 'Alice', 'email': 'alice@x.com', 'password': 'pw123'
        })
        self.assertEqual(r.status_code, 200)
        self.assertIn('successful', r.get_json()['message'])

    def test_tc06_register_duplicate_email(self):
        self.client.post('/register', json={'name': 'A', 'email': 'dup@x.com', 'password': 'p'})
        r = self.client.post('/register', json={'name': 'B', 'email': 'dup@x.com', 'password': 'p'})
        self.assertEqual(r.status_code, 400)
        self.assertIn('exists', r.get_json()['error'])

    def test_tc07_register_missing_fields(self):
        r = self.client.post('/register', json={'email': 'x@x.com'})
        self.assertEqual(r.status_code, 400)

    def test_tc08_login_success(self):
        self.client.post('/register', json={'name': 'L', 'email': 'l@x.com', 'password': 'pw'})
        r = self.client.post('/login', json={'email': 'l@x.com', 'password': 'pw'})
        self.assertEqual(r.status_code, 200)

    def test_tc09_login_wrong_password(self):
        self.client.post('/register', json={'name': 'W', 'email': 'w@x.com', 'password': 'pw'})
        r = self.client.post('/login', json={'email': 'w@x.com', 'password': 'wrong'})
        self.assertEqual(r.status_code, 401)

    def test_tc10_login_nonexistent_user(self):
        r = self.client.post('/login', json={'email': 'nope@x.com', 'password': 'p'})
        self.assertEqual(r.status_code, 401)

    def test_tc11_logout(self):
        self._auth(email='lo@x.com')
        r = self.client.post('/logout')
        self.assertEqual(r.status_code, 200)
        # After logout, profile should be unauthorized
        r2 = self.client.get('/api/profile')
        self.assertEqual(r2.status_code, 401)


# ═══════════════════════════════════════════════
# 3. PREDICT / SIMULATION
# ═══════════════════════════════════════════════
class TestPredict(BaseTestCase):
    """TC12-TC17: Health simulation engine."""

    def test_tc12_predict_basic(self):
        r = self.client.post('/predict', json={'age': 25, 'height': 175, 'weight': 70})
        self.assertEqual(r.status_code, 200)
        d = r.get_json()
        self.assertIn('health_score', d)
        self.assertIn('bmi', d)

    def test_tc13_bmi_normal(self):
        r = self.client.post('/predict', json={'age': 25, 'height': 175, 'weight': 70})
        d = r.get_json()
        self.assertAlmostEqual(d['bmi'], 70 / (1.75**2), places=1)
        self.assertEqual(d['bmi_category'], 'Normal Weight')

    def test_tc14_bmi_overweight(self):
        r = self.client.post('/predict', json={'age': 30, 'height': 170, 'weight': 80})
        self.assertEqual(r.get_json()['bmi_category'], 'Overweight')

    def test_tc15_bmi_obese(self):
        r = self.client.post('/predict', json={'age': 40, 'height': 165, 'weight': 110})
        self.assertEqual(r.get_json()['bmi_category'], 'Obese')

    def test_tc16_bmi_underweight(self):
        r = self.client.post('/predict', json={'age': 20, 'height': 180, 'weight': 50})
        self.assertEqual(r.get_json()['bmi_category'], 'Underweight')

    def test_tc17_exercise_reduces_risk(self):
        """More exercise should reduce cardiovascular risk."""
        r_low = self.client.post('/predict', json={'age': 30, 'height': 170, 'weight': 75, 'exercise': 0})
        r_high = self.client.post('/predict', json={'age': 30, 'height': 170, 'weight': 75, 'exercise': 60})
        self.assertGreater(
            r_low.get_json()['heart_disease'],
            r_high.get_json()['heart_disease']
        )

    def test_tc18_predict_invalid_input(self):
        r = self.client.post('/predict', json={'age': 'abc', 'height': 170, 'weight': 70})
        self.assertEqual(r.status_code, 400)

    def test_tc19_predict_saves_data_when_logged_in(self):
        self._auth(email='pred@x.com')
        self.client.post('/predict', json={'age': 22, 'height': 180, 'weight': 65, 'exercise': 45})
        r = self.client.get('/get_data')
        d = r.get_json()
        self.assertEqual(d['age'], 22)
        self.assertEqual(d['exercise'], 45)


# ═══════════════════════════════════════════════
# 4. NUTRITION API
# ═══════════════════════════════════════════════
class TestNutrition(BaseTestCase):
    """TC20-TC23: Nutrition save + retrieve."""

    def test_tc20_nutrition_requires_auth(self):
        r = self.client.post('/api/nutrition', json={'dailyTotal': {}, 'meals': {}})
        self.assertEqual(r.status_code, 401)

    def test_tc21_nutrition_save_and_get(self):
        self._auth(email='nut@x.com')
        payload = {
            'dailyTotal': {'carbs': 100, 'protein': 50, 'fiber': 20, 'calories': 800},
            'meals': {'Breakfast': {'status': 'completed', 'items': [{'name': 'Oats'}]}}
        }
        r = self.client.post('/api/nutrition', json=payload)
        self.assertEqual(r.status_code, 200)

        r2 = self.client.get('/api/nutrition')
        d = r2.get_json()
        self.assertEqual(d['dailyTotal']['carbs'], 100)
        self.assertEqual(d['meals']['Breakfast']['status'], 'completed')

    def test_tc22_nutrition_get_no_data(self):
        self._auth(email='empty@x.com')
        r = self.client.get('/api/nutrition')
        # Should return null/None when no data
        self.assertIn(r.status_code, [200])


# ═══════════════════════════════════════════════
# 5. NUTRITION ANALYSIS (time-range)
# ═══════════════════════════════════════════════
class TestNutritionAnalysis(BaseTestCase):
    """TC23-TC27: Analysis endpoint with ranges."""

    def test_tc23_analysis_unauthenticated(self):
        r = self.client.get('/api/nutrition_analysis?range=daily')
        self.assertEqual(r.status_code, 200)
        d = r.get_json()
        self.assertEqual(d['carbs'], 0)

    def test_tc24_analysis_daily(self):
        self._auth(email='ana@x.com')
        # Save nutrition first
        self.client.post('/api/nutrition', json={
            'dailyTotal': {'carbs': 200, 'protein': 60, 'fiber': 25, 'calories': 1400},
            'meals': {}
        })
        r = self.client.get('/api/nutrition_analysis?range=daily')
        d = r.get_json()
        self.assertEqual(d['carbs'], 200)
        self.assertEqual(d['days'], 1)

    def test_tc25_analysis_7days(self):
        self._auth(email='ana7@x.com')
        self.client.post('/api/nutrition', json={
            'dailyTotal': {'carbs': 100, 'protein': 40, 'fiber': 15, 'calories': 700},
            'meals': {}
        })
        r = self.client.get('/api/nutrition_analysis?range=7days')
        d = r.get_json()
        self.assertEqual(d['days'], 7)

    def test_tc26_analysis_10days(self):
        self._auth(email='ana10@x.com')
        r = self.client.get('/api/nutrition_analysis?range=10days')
        d = r.get_json()
        self.assertEqual(d['days'], 10)
        self.assertIn('logged_days', d)

    def test_tc27_analysis_30days(self):
        self._auth(email='ana30@x.com')
        r = self.client.get('/api/nutrition_analysis?range=30days')
        d = r.get_json()
        self.assertEqual(d['days'], 30)


# ═══════════════════════════════════════════════
# 6. PROFILE API
# ═══════════════════════════════════════════════
class TestProfile(BaseTestCase):
    """TC28-TC30: Profile CRUD."""

    def test_tc28_profile_unauthorized(self):
        r = self.client.get('/api/profile')
        self.assertEqual(r.status_code, 401)

    def test_tc29_profile_save_and_get(self):
        self._auth(email='prof@x.com')
        r = self.client.post('/api/profile', json={
            'location': 'Mumbai',
            'gender': 'Male',
            'age': 25,
            'height': 175,
            'weight': 70,
            'activity_level': 'Moderately active',
            'medical_conditions': 'none',
            'goals': ['Diet plan']
        })
        self.assertEqual(r.status_code, 200)

        r2 = self.client.get('/api/profile')
        d = r2.get_json()
        self.assertEqual(d['location'], 'Mumbai')
        self.assertEqual(d['gender'], 'Male')

    def test_tc30_profile_update_syncs_health_data(self):
        self._auth(email='sync@x.com')
        self.client.post('/api/profile', json={
            'location': 'Delhi', 'gender': 'Female', 'age': 28,
            'height': 162, 'weight': 55, 'activity_level': 'Lightly active',
            'medical_conditions': 'none', 'goals': []
        })
        r = self.client.get('/get_data')
        d = r.get_json()
        self.assertEqual(d['age'], 28)
        self.assertEqual(d['height'], 162)


# ═══════════════════════════════════════════════
# 7. WORKOUT LOG
# ═══════════════════════════════════════════════
class TestWorkoutLog(BaseTestCase):
    """TC31-TC33: Workout log CRUD."""

    def test_tc31_workout_log_requires_auth(self):
        r = self.client.get('/api/workout_log')
        self.assertEqual(r.status_code, 401)

    def test_tc32_workout_log_save_and_get(self):
        self._auth(email='work@x.com')
        r = self.client.post('/api/workout_log', json={
            'calories_burned': 150, 'exercises_done': 5, 'done_ids': [1, 2, 3]
        })
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json()['status'], 'saved')

        r2 = self.client.get('/api/workout_log')
        d = r2.get_json()
        self.assertIsNotNone(d['today'])
        self.assertEqual(d['today']['calories_burned'], 150)
        self.assertEqual(d['today']['exercises_done'], 5)

    def test_tc33_workout_log_history(self):
        self._auth(email='hist@x.com')
        self.client.post('/api/workout_log', json={
            'calories_burned': 200, 'exercises_done': 8, 'done_ids': []
        })
        r = self.client.get('/api/workout_log')
        d = r.get_json()
        self.assertIsInstance(d['history'], list)
        self.assertGreaterEqual(len(d['history']), 1)


# ═══════════════════════════════════════════════
# 8. SLEEP LOG STATUS
# ═══════════════════════════════════════════════
class TestSleepLog(BaseTestCase):
    """TC34-TC35: Sleep log status."""

    def test_tc34_sleep_log_unauthenticated(self):
        r = self.client.get('/api/sleep_log_status')
        d = r.get_json()
        self.assertFalse(d['logged'])

    def test_tc35_sleep_log_authenticated_default(self):
        self._auth(email='sleep@x.com')
        r = self.client.get('/api/sleep_log_status')
        d = r.get_json()
        self.assertIn('logged', d)
        self.assertIn('yesterday', d)


# ═══════════════════════════════════════════════
# 9. WORKOUT RECOMMENDATIONS
# ═══════════════════════════════════════════════
class TestWorkoutRecommendations(BaseTestCase):
    """TC36-TC38: Condition-based workout recommendations."""

    def test_tc36_recommendations_unauthenticated(self):
        r = self.client.get('/api/workout_recommendations')
        d = r.get_json()
        self.assertEqual(d['detected_tags'], [])

    def test_tc37_recommendations_no_condition(self):
        self._auth(email='nocond@x.com')
        self.client.post('/api/profile', json={
            'location': 'X', 'gender': 'Male', 'age': 25,
            'height': 175, 'weight': 70, 'activity_level': 'Active',
            'medical_conditions': 'none', 'goals': []
        })
        r = self.client.get('/api/workout_recommendations')
        d = r.get_json()
        self.assertEqual(d['detected_tags'], [])

    def test_tc38_recommendations_with_condition(self):
        self._auth(email='cond@x.com')
        self.client.post('/api/profile', json={
            'location': 'X', 'gender': 'Male', 'age': 40,
            'height': 170, 'weight': 85, 'activity_level': 'Active',
            'medical_conditions': 'Type 2 Diabetes, High blood pressure', 'goals': []
        })
        r = self.client.get('/api/workout_recommendations')
        d = r.get_json()
        self.assertIn('diabetes', d['detected_tags'])
        self.assertIn('hypertension', d['detected_tags'])


# ═══════════════════════════════════════════════
# 10. HISTORY + EDGE CASES
# ═══════════════════════════════════════════════
class TestHistory(BaseTestCase):
    """TC39-TC40: History endpoint."""

    def test_tc39_history_unauthenticated(self):
        r = self.client.get('/api/history')
        self.assertEqual(r.status_code, 401)

    def test_tc40_history_empty(self):
        self._auth(email='emhist@x.com')
        r = self.client.get('/api/history')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.get_json(), [])


# ═══════════════════════════════════════════════
# RUN
# ═══════════════════════════════════════════════
if __name__ == '__main__':
    # Use a separate test database
    import app as app_module
    app_module.DATABASE = 'test_digital_twin.db'
    # Remove old test DB
    if os.path.exists('test_digital_twin.db'):
        os.remove('test_digital_twin.db')
    init_db()

    unittest.main(verbosity=2)
