@"
# ResearchPath Backend (FastAPI + Gemini)

## Run
1. python -m venv venv
2. .\venv\Scripts\Activate.ps1
3. pip install -r requirements.txt
4. Create .env with GEMINI_API_KEY and AI_MODEL=gemini-3.5-flash
5. uvicorn main:app --reload
6. Open http://127.0.0.1:8000/docs

## AI features
- /coach: scores a research idea, asks a guiding question, suggests 3 better questions (English, Kannada, Hindi)
- /summarize: plain-language summary with key terms and readability grade before and after
- /alt-text: describes charts for screen readers
- /quiz: quiz from lesson text
- /credibility: helps judge a source
- /mentor/feedback: feedback on a learner's draft

## Test
.\test_api.ps1
"@ | Set-Content README.md