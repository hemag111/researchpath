const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

const post = (path, body) =>
  request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const coach = (idea, language = "English") => post("/coach", { idea, language });
export const summarize = (text, level = "simple", language = "English") =>
  post("/summarize", { text, level, language });
export const makeQuiz = (lesson_text, count = 5) => post("/quiz", { lesson_text, count });
export const checkSource = (source_text) => post("/credibility", { source_text });
export const mentorFeedback = (user_id, draft) => post("/mentor/feedback", { user_id, draft });

export const altText = (file) => {
  const form = new FormData();
  form.append("file", file);
  return request("/alt-text", { method: "POST", body: form });
};

export const saveProfile = (user_id, name, needs) =>
  request(`/profile/${user_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, needs }),
  });
export const getProfile = (user_id) => request(`/profile/${user_id}`);

export const addNote = (user_id, text) => post("/workspace/notes", { user_id, text });
export const getNotes = (user_id) => request(`/workspace/notes/${user_id}`);
export const addSource = (user_id, title, url = "", notes = "") =>
  post("/workspace/sources", { user_id, title, url, notes });
export const getSources = (user_id) => request(`/workspace/sources/${user_id}`);

export const setProgress = (user_id, module, completed = true) =>
  post("/progress", { user_id, module, completed });
export const getProgress = (user_id) => request(`/progress/${user_id}`);