# ResearchPath

An accessible e-learning platform that teaches **how to do research** from scratch. Built for Case Study 3 (Accessible E-Learning Platform) with learners of all abilities in mind, including blind, low-vision, dyslexic, ADHD and motor-impaired learners, and non-native English speakers.

**Demo story:** Asha, a visually impaired student who has never written a research paper, signs in, picks her accessibility profile, and is guided from a vague idea to a clear research question, entirely by keyboard and screen reader.

## What it does

- **Course path:** find a topic, ask a research question, review literature, choose a method, collect and analyze data, write and cite, present.
- **AI Research Question Coach:** answers beginner questions about research, or scores a research idea and suggests sharper questions (English, Kannada, Hindi).
- **Plain-language summarizer:** turns academic abstracts into simple language, with readability grades before and after.
- **Chart alt-text:** describes charts and images for screen reader users.
- **Quiz generator, source credibility checker, mentor feedback.**
- **Research Workspace:** notes and source tracker saved to a database.

## Accessibility features

- Profile switcher: high contrast, larger text, dyslexia-friendly font, focus mode (settings are remembered in the browser).
- Skip-to-content link, labelled navigation, full keyboard navigation.
- Focus moves to the page heading when you change pages, and each page updates the browser title.
- AI results are announced to screen readers (`aria-live`).

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | FastAPI (Python), SQLite |
| AI | Google Gemini API (`google-genai`) |

## Project structure

```
researchpath/
  backend/    FastAPI + Gemini AI features
  frontend/   React + Vite app
  design/     UI screens (HTML)
  docs/       Requirements, personas, course content
```

## Run it locally

You need Python 3.11+, Node.js, and a free Gemini API key from https://aistudio.google.com/apikey

**1. Backend** (PowerShell, window 1)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# open .env and paste your Gemini key
python -m uvicorn main:app --reload
```
API docs open at http://127.0.0.1:8000/docs

**2. Frontend** (PowerShell, window 2)
```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```
Open http://localhost:5173 and use the **Coach** page for the AI coach.

> Never commit your `.env` file. It holds your private API key.

## API overview

| Endpoint | Purpose |
|---|---|
| `POST /coach` | Answer a research question or score a research idea |
| `POST /summarize` | Plain-language summary with key terms and readability grades |
| `POST /alt-text` | Describe an uploaded chart or image |
| `POST /quiz` | Generate quiz questions from lesson text |
| `POST /credibility` | Questions to help judge a source |
| `POST /mentor/feedback` | AI feedback on a learner's draft |
| `PUT/GET /profile/{user_id}` | Save and load accessibility profile |
| `POST/GET /workspace/notes` and `/workspace/sources` | Research workspace |
| `POST/GET /progress` | Track module progress |

## Team

| Name | GitHub | Role |
|---|---|---|
| Hema G | [@hemag111](https://github.com/hemag111) | Backend and AI (FastAPI, Gemini, database) |
| Dhanuja | [@DhanujaHN123](https://github.com/DhanujaHN123) | Frontend (React, accessibility) |
| Bhoomika | [@PNBhoomika](https://github.com/PNBhoomika) | UI/UX design |
| Kusumitha | [@Kusumithak](https://github.com/Kusumithak) | Requirements, personas, course content |

Original team repositories: [frontend](https://github.com/DhanujaHN123/ResearchPath), [design](https://github.com/PNBhoomika/ResearchPlan3), [docs](https://github.com/Kusumithak/Researchplan).