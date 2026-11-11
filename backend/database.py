import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "researchpath.db"


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_conn() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS profiles(
            user_id TEXT PRIMARY KEY,
            name TEXT,
            needs TEXT DEFAULT ''
        );
        CREATE TABLE IF NOT EXISTS notes(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            text TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS sources(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            title TEXT,
            url TEXT,
            notes TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS progress(
            user_id TEXT,
            module INTEGER,
            completed INTEGER DEFAULT 0,
            PRIMARY KEY(user_id, module)
        );
        CREATE TABLE IF NOT EXISTS feedback(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            draft TEXT,
            comment TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
        """)