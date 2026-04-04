# HealthPulse+

> **HACKSAGON 2026 Finalist** — Built by **Team Kirmada**

HealthPulse is a full-stack, AI-powered healthcare platform that unifies telemedicine, an AI health assistant, pharmacy bidding, and multilingual voice interaction — all under one roof.

---

## 🏗️ Architecture Overview

The project is a **monorepo** with 4 independently running services that communicate with each other over HTTP and WebSocket:

```
Health_Pulse/
├── frontend/          → React + Vite UI (port 5173)
├── backend/           → Node.js + Express API (port 5000)
├── ai_agent/
│   └── medical_bot/   → Python Flask AI Chatbot & Voice Server (port 5500)
└── report_Ai/         → Python Flask OCR Report Extractor (port 5501)
```

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🩺 **Live Telemedicine** | WebRTC video calls via ZegoCloud with real-time notes & prescription sync |
| 🤖 **AI Health Assistant** | RAG-grounded chatbot using Groq LLM + ChromaDB — responds in your own language |
| 🏥 **HP-ID Verified Doctors** | Doctors must register with their Healthcare Professional ID |
| ⭐ **Post-Session Ratings** | Patients rate doctors after each consultation; rolling average updates the doctor's profile |
| 🎤 **Multilingual Voice** | Sarvam AI TTS + Whisper STT for native Hindi/English voice interactions |
| 🧠 **AI Symptom Analyzer** | Describe symptoms via text or voice; LLM routes you to the right specialist |
| 💊 **Pharmacy Marketplace** | Prescription is broadcast to nearby shopkeepers who bid for best price |
| 📋 **OCR Report Parser** | Upload a medical report image to extract structured data via EasyOCR |
| 🌐 **Multilingual UI** | Toggle between English and Hindi across the entire interface |

---

## 🚀 Getting Started

You need **4 terminal windows** open — one for each service.

### Prerequisites

- **Node.js** v18 or higher
- **Python** 3.10 or higher
- **MongoDB** Atlas account (or local MongoDB)
- **ZegoCloud** account for video calls
- **Groq** API key for LLM

---

### 1️⃣ Backend (Node.js — Port 5000)

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then start the server:

```bash
node app.js
# or for auto-reload:
npx nodemon app.js
```

✅ Server runs at `http://localhost:5000`

---

### 2️⃣ Frontend (React + Vite — Port 5173)

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_ZC_SERVER_SECRET=your_zegocloud_server_secret
VITE_ZC_APP_ID=your_zegocloud_app_id
VITE_BACKEND_ROUTE=http://localhost:5000
VITE_AI_ROUTE=http://127.0.0.1:5500
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then start the dev server:

```bash
npm run dev
```

✅ App runs at `http://localhost:5173`

---

### 3️⃣ AI Chatbot & Voice Server (Python Flask — Port 5500)

```bash
cd ai_agent/medical_bot
```

Create a `.env` file inside `ai_agent/medical_bot/`:

```env
GROQ_API_KEY=your_groq_api_key
HUGGINGFACEHUB_API_TOKEN=your_huggingface_token
```

Install dependencies and run:

```bash
pip install -r requirements.txt
python app.py
```

✅ AI server runs at `http://127.0.0.1:5500`

> **Note for Windows users:** If you see a `DLL initialization failed` error related to PyTorch, try running `pip install torch --index-url https://download.pytorch.org/whl/cpu` to install the CPU-only version.

---

### 4️⃣ OCR Report Extractor (Python Flask — Port 5501)

```bash
cd report_Ai
pip install -r requirements.txt
python app.py
```

✅ Report extraction server runs at `http://localhost:5501`

---

## 🗺️ Full Startup Checklist

Open **4 separate terminals** and run in order:

| # | Directory | Command | Port |
|---|---|---|---|
| 1 | `backend/` | `node app.js` | `5000` |
| 2 | `frontend/` | `npm run dev` | `5173` |
| 3 | `ai_agent/medical_bot/` | `python app.py` | `5500` |
| 4 | `report_Ai/` | `python app.py` | `5501` |

Then open your browser to **http://localhost:5173**

---

## 🗝️ Environment Variables Summary

| File | Key Variables |
|---|---|
| `backend/.env` | `PORT`, `MONGODB_URI`, `JWT_SECRET`, `TWILIO_*`, `SUPABASE_*` |
| `frontend/.env` | `VITE_ZC_*`, `VITE_BACKEND_ROUTE`, `VITE_AI_ROUTE`, `VITE_SUPABASE_*` |
| `ai_agent/medical_bot/.env` | `GROQ_API_KEY`, `HUGGINGFACEHUB_API_TOKEN` |

---

## 🛠️ Tech Stack

**Frontend:**
React · Vite · Tailwind CSS · Socket.IO Client · ZegoCloud WebRTC · Lucide React

**Backend:**
Node.js · Express · MongoDB (Mongoose) · Socket.IO · JWT · bcrypt · Twilio · Supabase

**AI Services:**
Python · Flask · ChromaDB · Groq LLM · Sarvam AI · HuggingFace Embeddings · RAG Pipeline

**OCR Service:**
Python · Flask · EasyOCR · PyTorch · OpenCV · TheFuzz

---

## 👥 Authors

**Team Kirmada** — HACKSAGON 2026

- Yash Jangir — Full Stack & AI Lead
