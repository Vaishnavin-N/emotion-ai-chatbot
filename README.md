# 🧠 EmoCare AI — Emotion-Aware Mental Health Chatbot

An AI-powered chatbot that detects your emotion from text and responds with empathy.

## 🚀 Live Demo
> Coming soon

## 📌 What It Does
- Detects emotion from user text (happy, sad, angry, fear, neutral)
- Responds with empathy based on detected emotion
- Supports voice input
- Built with real ML model trained on 69,000+ samples

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Ionic + Angular |
| Backend | Python + FastAPI |
| ML Model | Scikit-learn (Logistic Regression + TF-IDF) |
| AI | Groq Llama 3.3 |
| Voice | Web Speech API |

## ⚙️ How to Run

### Backend
```bash
cd emocare-backend
pip install -r requirements.txt
# Create .env file with your GROQ_API_KEY
python -m uvicorn api:app --reload
```

### Frontend
```bash
cd emocare-frontend
npm install
ionic serve
```

## 🔑 Environment Variables
Create a `.env` file in root folder:
```
GROQ_API_KEY=your_groq_api_key_here
```

## 📊 How It Works
```
User types message
      ↓
ML Model detects emotion
      ↓
Prompt built based on emotion
      ↓
Groq AI generates empathetic reply
      ↓
Reply shown in chat
```

## 👩‍💻 Built By
Vaishnavi N
