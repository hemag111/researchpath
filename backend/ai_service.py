import os
import json
import time
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).parent / ".env")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("AI_MODEL", "gemini-3.5-flash")
FALLBACK_MODEL = os.getenv("AI_FALLBACK_MODEL", "gemini-2.5-flash")

BUSY_MARKERS = ("503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED")


def _generate(contents, config):
    last_error = None
    for model in (MODEL, FALLBACK_MODEL):
        for attempt in range(3):
            try:
                return client.models.generate_content(
                    model=model, contents=contents, config=config
                ).text
            except Exception as e:
                last_error = e
                msg = str(e)
                if any(marker in msg for marker in BUSY_MARKERS):
                    time.sleep(2 ** attempt)  # wait 1s, 2s, 4s, then retry
                    continue
                if "404" in msg or "NOT_FOUND" in msg:
                    break  # this model name is not available, try the next one
                raise
    raise last_error


def ask(system: str, user: str, max_tokens: int = 800) -> str:
    config = types.GenerateContentConfig(system_instruction=system)
    return _generate(user, config)


def ask_json(system: str, user: str, max_tokens: int = 1000):
    config = types.GenerateContentConfig(
        system_instruction=system + " Reply with ONLY valid JSON.",
        response_mime_type="application/json",
    )
    text = _generate(user, config)
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


def describe_image(data: bytes, media_type: str) -> str:
    contents = [
        types.Part.from_bytes(data=data, mime_type=media_type),
        "Describe this chart or image for a blind user using a screen reader. "
        "Start with the type of chart, then the main trend, then key numbers. Be brief and factual.",
    ]
    return _generate(contents, types.GenerateContentConfig())