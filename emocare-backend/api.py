from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq

from emotion_classifier import predict_emotion
from prompt_builder import build_system_prompt

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env file")

print(f"API Key loaded: {API_KEY[:10]}...")
client = Groq(api_key=API_KEY)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_input: str


@app.post("/chat")
def chat(request: ChatRequest):
    user_input = request.user_input
    print(f"Received: {user_input}")

    try:
        emotion = predict_emotion(user_input)
        print(f"Detected emotion: {emotion}")
    except Exception as e:
        print(f"Emotion detection failed: {e}")
        emotion = "neutral"

    try:
        system_prompt = build_system_prompt(emotion, 1)
    except Exception as e:
        print(f"Prompt building failed: {e}")
        system_prompt = "You are a caring emotional support assistant."

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
        )
        reply = response.choices[0].message.content
        print(f"Groq reply: {reply[:100]}...")
    except Exception as e:
        print(f"Groq Error: {repr(e)}")
        reply = f"Error: {str(e)}"

    return {
        "emotion": emotion,
        "reply": reply
    }
