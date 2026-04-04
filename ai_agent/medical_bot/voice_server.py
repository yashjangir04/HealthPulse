"""
HealthPulse Voice Command Server  — v2
Standalone Flask microservice (no PyTorch / LangChain).
Port 5501 — never collides with app.py (5500).

New in v2:
  • Returns detected_language from Sarvam AI so the frontend can TTS in the right language.
  • /api/tts  — converts any English text back to speech in the requested Indian language.
"""

import os
import tempfile
import json
import requests as http_requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from sarvamai import SarvamAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ───────────────────────────────────────────────
# Sarvam language codes we support for TTS
# ───────────────────────────────────────────────
LANG_MAP = {
    "hi": "hi-IN",   # Hindi
    "ta": "ta-IN",   # Tamil
    "te": "te-IN",   # Telugu
    "mr": "mr-IN",   # Marathi
    "bn": "bn-IN",   # Bengali
    "gu": "gu-IN",   # Gujarati
    "kn": "kn-IN",   # Kannada
    "ml": "ml-IN",   # Malayalam
    "pa": "pa-IN",   # Punjabi
    "od": "od-IN",   # Odia
    "en": "en-IN",   # English (Indian)
}

# ───────────────────────────────────────────────
# Intent classification  via Groq (raw REST)
# ───────────────────────────────────────────────

SYSTEM_PROMPT = """You are an intent classification assistant for a medical health application called HealthPulse.
Your ONLY job is to output a single raw JSON object. Never use markdown formatting.

Given the user's voice command (already translated to English), classify it:

NAVIGATION ROUTES (when user wants to GO somewhere):
1. /lobby/general        → Call a general doctor, talk to a doctor, emergency, need help
2. /lobby/cardiologist   → Call a cardiologist, heart problem, chest pain, heart specialist
3. /lobby/dermatologist  → Call a dermatologist, skin problem, rash, skin specialist
4. /lobby/neurologist    → Call a neurologist, brain, headache specialist, neuro
5. /lobby/orthopedic     → Call an orthopedic, bone problem, joint pain
6. /lobby/pediatrician   → Call a pediatrician, child doctor
7. /medi-list            → Show my reports, check medicines, prescriptions, medication list
8. /appointments         → Show my schedule, my appointments, medical schedule, upcoming visits
9. /contact              → Contact page, support
10. /patient/orders      → My orders, medicine delivery, order tracking
11. /connect             → Connect with doctors, find doctors
12. /profile             → My profile, account settings, personal information

CHATBOT MEDICAL QUERIES (when user asks a medical/health question like symptoms, pain, remedies, advice):
- Use path "/ai-help"
- Set "chatMessage" to the ORIGINAL translated English question so the chatbot can answer it.
- Examples: "my head is aching what should I do", "I have fever", "what is diabetes", "I feel chest pain", "what medicine for cold"

Return ONLY this JSON (no markdown):
{"action": "navigate", "path": "<route>", "message": "<brief friendly English acknowledgement>", "chatMessage": "<the medical question if going to ai-help, else empty string>"}
"""


def classify_intent(english_text):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {"action": "navigate", "path": "/", "message": "Groq API key missing.", "chatMessage": ""}

    try:
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": english_text},
            ],
            "temperature": 0.1,
        }
        res = http_requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers, json=payload, timeout=15
        )
        res.raise_for_status()
        raw = res.json()["choices"][0]["message"]["content"].strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
        result = json.loads(raw)
        if "chatMessage" not in result:
            result["chatMessage"] = ""
        return result
    except Exception as e:
        print(f"[Groq Intent Error] {e}")
        return {
            "action": "navigate",
            "path": "/ai-help",
            "message": "Couldn't classify the command. Taking you to AI Help.",
            "chatMessage": english_text,
        }


# ───────────────────────────────────────────────
# /api/voice-command  — speech → translate → intent
# ───────────────────────────────────────────────

@app.route("/api/voice-command", methods=["POST"])
def voice_command():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    sarvam_key = os.getenv("SARVAM_API_KEY", "")
    if not sarvam_key:
        return jsonify({"error": "SARVAM_API_KEY missing from .env"}), 500

    try:
        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            audio_file.save(tmp.name)
            tmp_path = tmp.name

        sarvam = SarvamAI(api_subscription_key=sarvam_key)

        # Transcribe + translate to English, also detect language
        with open(tmp_path, "rb") as f:
            stt_resp = sarvam.speech_to_text.transcribe(
                file=f, model="saaras:v3", mode="translate"
            )
        os.unlink(tmp_path)

        # Extract translated text
        if hasattr(stt_resp, "transcript"):
            translated = stt_resp.transcript
        elif hasattr(stt_resp, "translated_text"):
            translated = stt_resp.translated_text
        elif isinstance(stt_resp, dict):
            translated = stt_resp.get("transcript", stt_resp.get("translated_text", str(stt_resp)))
        else:
            translated = str(stt_resp)

        # Try to get detected language code
        detected_lang = "hi"  # default fallback
        if hasattr(stt_resp, "language_code"):
            detected_lang = stt_resp.language_code or "hi"
        elif isinstance(stt_resp, dict):
            detected_lang = stt_resp.get("language_code", "hi")

        print(f"[Sarvam] Translated: {translated} | Lang: {detected_lang}")

        intent = classify_intent(translated)
        intent["translatedText"] = translated
        intent["detectedLanguage"] = detected_lang

        print(f"[Groq]   Intent: {intent}")
        return jsonify(intent)

    except Exception as e:
        print(f"[Voice Error] {e}")
        return jsonify({"error": str(e)}), 500


# ───────────────────────────────────────────────
# /api/tts  — convert English AI answer → audio in detected language
# ───────────────────────────────────────────────

@app.route("/api/tts", methods=["POST"])
def text_to_speech():
    body = request.get_json()
    text = body.get("text", "")
    lang_code = body.get("language", "hi")          # e.g. "hi", "ta", "te"
    sarvam_key = os.getenv("SARVAM_API_KEY", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400
    if not sarvam_key:
        return jsonify({"error": "SARVAM_API_KEY missing"}), 500

    try:
        target_lang = LANG_MAP.get(lang_code, "hi-IN")

        headers = {
            "api-subscription-key": sarvam_key,
            "Content-Type": "application/json",
        }

        # Step 1: Translate English answer → user's language (skip if already English)
        translated_text = text
        if lang_code != "en":
            try:
                translate_payload = {
                    "input": text[:1000],
                    "source_language_code": "en-IN",
                    "target_language_code": target_lang,
                    "speaker_gender": "Female",
                    "mode": "formal",
                    "model": "mayura:v1",
                    "enable_preprocessing": False,
                }
                tr = http_requests.post(
                    "https://api.sarvam.ai/translate",
                    headers=headers,
                    json=translate_payload,
                    timeout=20,
                )
                tr.raise_for_status()
                tr_data = tr.json()
                translated_text = tr_data.get("translated_text", text)
                print(f"[Translate] {lang_code}: {translated_text[:80]}...")
            except Exception as te:
                print(f"[Translate Warning] Falling back to English text: {te}")
                translated_text = text   # fallback: speak English if translate fails

        # Step 2: TTS the translated text
        tts_payload = {
            "inputs": [translated_text[:500]],
            "target_language_code": target_lang,
            "speaker": "meera",
            "pitch": 0,
            "pace": 1.0,
            "loudness": 1.5,
            "speech_sample_rate": 22050,
            "enable_preprocessing": True,
            "model": "bulbul:v1",
        }
        res = http_requests.post(
            "https://api.sarvam.ai/text-to-speech",
            headers=headers, json=tts_payload, timeout=20
        )
        res.raise_for_status()
        data = res.json()

        import base64
        audio_b64 = data.get("audios", [""])[0]
        audio_bytes = base64.b64decode(audio_b64)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
            f.write(audio_bytes)
            tmp_path = f.name

        return send_file(tmp_path, mimetype="audio/wav", as_attachment=False)

    except Exception as e:
        print(f"[TTS Error] {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "voice-command", "port": 5501})


if __name__ == "__main__":
    print("=" * 50)
    print("  HealthPulse Voice Command Server  v2")
    print("  http://127.0.0.1:5501")
    print("=" * 50)
    app.run(debug=True, port=5501, use_reloader=False)
