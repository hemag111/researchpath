from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils import reading_grade

from database import get_conn, init_db
import ai_service as ai

app = FastAPI(title="ResearchPath API")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------- AI FEATURES ----------

class CoachIn(BaseModel):
    idea: str
    language: str = "English"


COACH_FALLBACK = {
    "type": "idea",
    "scores": {"specific": 2, "answerable": 2, "relevant": 3, "doable": 3},
    "feedback": "The AI helper is busy right now, so here is a general tip: your idea is a good start, "
                "but it needs to be narrower. Name who you study, where, and what you want to find out.",
    "guiding_question": "Who exactly do you want to study, and in which place or situation?",
    "suggestions": [
        "How do first-year college students in Karnataka use online lectures to study?",
        "What problems do visually impaired students face when joining online classes?",
        "Which features of online courses help students finish them?",
    ],
}


@app.post("/coach")
def coach(body: CoachIn):
    system = f"""You are a friendly research coach for complete beginners. Reply in {body.language}, in plain language.

First decide what the learner wrote.

1) If it is a GENERAL QUESTION about doing research (for example: what is a literature review, how do I choose a method, how do I write a hypothesis), set "type" to "answer". Put a clear, direct, helpful answer in "feedback" (4 to 6 short sentences with one simple example). Set every score to 0. Do NOT reply with only a question.

2) If it is a RESEARCH IDEA or TOPIC, set "type" to "idea". Score it from 1 to 5 on specific, answerable, relevant, doable. Give short encouraging feedback (2 to 3 sentences) on what is too broad or unclear.

In both cases give 3 related research questions or follow-up questions in "suggestions", and one optional "guiding_question" to think about next.

Return JSON in exactly this shape: {{"type": "answer", "scores": {{"specific": 0, "answerable": 0, "relevant": 0, "doable": 0}}, "feedback": "...", "guiding_question": "...", "suggestions": ["...", "...", "..."]}}"""
    try:
        return ai.ask_json(system, body.idea)
    except Exception as e:
        print("coach error:", e)
        return {**COACH_FALLBACK, "fallback": True}


class SummarizeIn(BaseModel):
    text: str
    level: str = "simple"  # simple | intermediate
    language: str = "English"


@app.post("/summarize")
def summarize(body: SummarizeIn):
    system = (
        f"You explain academic papers at a {body.level} reading level in {body.language}, "
        "using short sentences and no jargon. "
        'Return JSON: {"summary": "...", "key_terms": [{"term": "...", "meaning": "..."}]}'
    )
    try:
        result = ai.ask_json(system, body.text, 1200)
    except Exception as e:
        print("summarize error:", e)
        raise HTTPException(502, "The AI helper is busy. Please try again in a minute.")
    if body.language.lower() == "english":
        result["original_grade"] = reading_grade(body.text)
        result["summary_grade"] = reading_grade(result.get("summary", ""))
    return result
@app.post("/alt-text")
async def alt_text(file: UploadFile = File(...)):
    if file.content_type not in ("image/png", "image/jpeg", "image/webp", "image/gif"):
        raise HTTPException(400, "Upload a png, jpg, webp or gif image")
    data = await file.read()
    try:
        return {"description": ai.describe_image(data, file.content_type)}
    except Exception as e:
        print("alt-text error:", e)
        raise HTTPException(502, "The AI helper is busy. Please try again in a minute.")

class QuizIn(BaseModel):
    lesson_text: str
    count: int = 3


@app.post("/quiz")
def quiz(body: QuizIn):
    system = (
        f"Create {body.count} multiple-choice questions from the lesson text for beginners. "
        'Return JSON: {"questions": [{"question": "...", "options": ["A","B","C","D"], '
        '"answer_index": 0, "explanation": "..."}]}'
    )
    try:
        return ai.ask_json(system, body.lesson_text, 1500)
    except Exception as e:
        raise HTTPException(502, f"AI error: {e}")


class CredibilityIn(BaseModel):
    source_text: str


@app.post("/credibility")
def credibility(body: CredibilityIn):
    system = (
        "Help a beginner judge a research source. Check author, date, evidence, bias and peer review. "
        'Return JSON: {"questions": ["...", "...", "..."], "verdict": "one short sentence"}'
    )
    try:
        return ai.ask_json(system, body.source_text)
    except Exception as e:
        raise HTTPException(502, f"AI error: {e}")


# ---------- PROFILE ----------

class ProfileIn(BaseModel):
    name: str = ""
    needs: str = ""  # e.g. "blind,dyslexia"


@app.put("/profile/{user_id}")
def save_profile(user_id: str, body: ProfileIn):
    with get_conn() as c:
        c.execute(
            "INSERT INTO profiles(user_id,name,needs) VALUES(?,?,?) "
            "ON CONFLICT(user_id) DO UPDATE SET name=excluded.name, needs=excluded.needs",
            (user_id, body.name, body.needs),
        )
    return {"ok": True}


@app.get("/profile/{user_id}")
def get_profile(user_id: str):
    with get_conn() as c:
        row = c.execute("SELECT * FROM profiles WHERE user_id=?", (user_id,)).fetchone()
    return dict(row) if row else {"user_id": user_id, "name": "", "needs": ""}


# ---------- WORKSPACE ----------

class NoteIn(BaseModel):
    user_id: str
    text: str


@app.post("/workspace/notes")
def add_note(body: NoteIn):
    with get_conn() as c:
        c.execute("INSERT INTO notes(user_id,text) VALUES(?,?)", (body.user_id, body.text))
    return {"ok": True}


@app.get("/workspace/notes/{user_id}")
def list_notes(user_id: str):
    with get_conn() as c:
        rows = c.execute("SELECT * FROM notes WHERE user_id=? ORDER BY id DESC", (user_id,)).fetchall()
    return [dict(r) for r in rows]


class SourceIn(BaseModel):
    user_id: str
    title: str
    url: str = ""
    notes: str = ""


@app.post("/workspace/sources")
def add_source(body: SourceIn):
    with get_conn() as c:
        c.execute(
            "INSERT INTO sources(user_id,title,url,notes) VALUES(?,?,?,?)",
            (body.user_id, body.title, body.url, body.notes),
        )
    return {"ok": True}


@app.get("/workspace/sources/{user_id}")
def list_sources(user_id: str):
    with get_conn() as c:
        rows = c.execute("SELECT * FROM sources WHERE user_id=? ORDER BY id DESC", (user_id,)).fetchall()
    return [dict(r) for r in rows]


# ---------- PROGRESS ----------

class ProgressIn(BaseModel):
    user_id: str
    module: int
    completed: bool = True


@app.post("/progress")
def set_progress(body: ProgressIn):
    with get_conn() as c:
        c.execute(
            "INSERT INTO progress(user_id,module,completed) VALUES(?,?,?) "
            "ON CONFLICT(user_id,module) DO UPDATE SET completed=excluded.completed",
            (body.user_id, body.module, int(body.completed)),
        )
    return {"ok": True}


@app.get("/progress/{user_id}")
def get_progress(user_id: str):
    with get_conn() as c:
        rows = c.execute("SELECT module, completed FROM progress WHERE user_id=?", (user_id,)).fetchall()
    done = [r["module"] for r in rows if r["completed"]]
    return {"completed_modules": done, "percent": round(len(done) / 7 * 100)}


# ---------- MENTOR ----------

class DraftIn(BaseModel):
    user_id: str
    draft: str


@app.post("/mentor/feedback")
def mentor_feedback(body: DraftIn):
    system = (
        "You are a kind research mentor. Give feedback on a beginner's draft in plain language: "
        "2 things done well, 2 things to improve, and 1 next step. Keep it under 150 words."
    )
    try:
        comment = ai.ask(system, body.draft)
    except Exception as e:
        raise HTTPException(502, f"AI error: {e}")
    with get_conn() as c:
        c.execute("INSERT INTO feedback(user_id,draft,comment) VALUES(?,?,?)",
                  (body.user_id, body.draft, comment))
    return {"comment": comment}
