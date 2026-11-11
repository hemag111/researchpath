import { useState } from "react";
import { coach } from "./backendApi";

export default function ResearchCoach() {
  const [idea, setIdea] = useState("");
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await coach(idea, language));
    } catch (err) {
      setError("Could not reach the coach. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  const isAnswer = result?.type === "answer";

  return (
    <section aria-labelledby="coach-heading">
      <h1 id="coach-heading" tabIndex="-1">Research Question Coach</h1>
      <p>Ask a research question (like "What is a literature review?") or share a research idea.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="idea">Your question or research idea</label>
        <textarea
          id="idea"
          rows={3}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Example: What is a literature review?  or  I want to research online learning"
        />
        <label htmlFor="language">Answer language</label>
        <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Kannada</option>
          <option>Hindi</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Get help"}
        </button>
      </form>

      <div aria-live="polite">
        {loading && <p>The coach is thinking, please wait.</p>}
        {error && <p role="alert">{error}</p>}
        {result && (
          <div>
            <h2>{isAnswer ? "Answer" : "Feedback"}</h2>
            <p>{result.feedback}</p>

            {!isAnswer && (
              <>
                <h2>Scores (1 to 5)</h2>
                <ul>
                  {Object.entries(result.scores || {}).map(([name, value]) => (
                    <li key={name}>
                      {name}: {value}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {result.guiding_question && (
              <>
                <h2>Think about this</h2>
                <p>{result.guiding_question}</p>
              </>
            )}

            <h2>{isAnswer ? "Questions to explore next" : "Sharper questions you could ask"}</h2>
            <ul>
              {(result.suggestions || []).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}