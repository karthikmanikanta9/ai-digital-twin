# Health Digital Twin Platform 🧬 AI-Powered Predictive Healthcare

### Live Demo: [https://gowrish08.pythonanywhere.com/](https://gowrish08.pythonanywhere.com/)


Welcome to the **Health Digital Twin** platform! This is a state-of-the-art predictive healthcare application that generates a personalized digital representation of your health based on your daily habits, biometrics, and medical data.

## 🌟 Key Features

*   **Holistic Health Prediction:** Uses a unified Vitality Score to summarize your current state, combining predicted risks for Heart Disease, Type-2 Diabetes, and Obesity.
*   **Daily Snapshots & Logs:** Users can track sleep, nutrition, and exercise directly on the platform and see real-time updates to their health outcomes.
*   **AI Diet & Workout Planning:** By leveraging Gemini 2.5 Flash, the app provides hyper-personalized diet charts and specific exercise recommendations uniquely tailored to individual medical conditions (e.g., Hypertension, PCOS, Asthma).
*   **Nutrition Analyzer:** Interactive tracking of protein, carbs, fiber, and calories to compute a dynamically accurate Diet Score.
*   **Interactive Simulation:** See the real-time effect of adding "30 more minutes of exercise" or "2 extra hours of sleep" on your future health trajectory.

## 💻 Tech Stack
*   **Backend:** Python, Flask, SQLite
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript 
*   **AI Integration:** Google GenAI (Gemini 2.5 Flash)
*   **Security:** Werkzeug Hashing

## 🚀 Setup & Installation (Local)
1. Clone the repository.
2. Install dependencies: `pip install -r requirements.txt`
3. Add your Gemini API Key directly or in a `.env` file (`GEMINI_API_KEY=your_key`).
4. Run the app: `python app.py`

## 🔮 Future Roadmap
*   Migration to a cloud PostgreSQL database for persistent remote storage.
*   Wearable device integration (Apple Health, Garmin) for real-time data sync.
*   Mental health tracking for a completely comprehensive digital twin.
