import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent / ".env")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("AI_MODEL", "gemini-3.5-flash")


def ask(system: str, user: str, max_tokens: int = 800) -> str:
    r = client.models.generate_content(
        model=MODEL,
        contents=user,
        config=types.GenerateContentConfig(system_instruction=system),
    )
    return r.text


def ask_json(system: str, user: str, max_tokens: int = 1000):
    r = client.models.generate_content(
        model=MODEL,
        contents=user,
        config=types.GenerateContentConfig(
            system_instruction=system + " Reply with ONLY valid JSON.",
            response_mime_type="application/json",
        ),
    )
    text = r.text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


def describe_image(data: bytes, media_type: str) -> str:
    r = client.models.generate_content(
        model=MODEL,
        contents=[
            types.Part.from_bytes(data=data, mime_type=media_type),
            "Describe this chart or image for a blind user using a screen reader. "
            "Start with the type of chart, then the main trend, then key numbers. Be brief and factual.",
        ],
    )
    return r.text