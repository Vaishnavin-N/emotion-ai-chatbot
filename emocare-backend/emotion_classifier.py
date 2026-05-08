import joblib
import re

# Load trained model
model = joblib.load("emotion_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)
    return text

def predict_emotion(text):
    text = clean_text(text)
    vec = vectorizer.transform([text])
    emotion = model.predict(vec)[0]
    return emotion

if __name__ == "__main__":
    print(predict_emotion("I am really afraid of my exam"))
    print(predict_emotion("I feel hopeless and disappointed"))
    print(predict_emotion("I am excited about my future"))