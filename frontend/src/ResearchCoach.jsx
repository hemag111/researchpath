
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
    <main className="research-coach-page">
      <section className="research-coach-hero">
        <div>
          <span className="research-coach-tag">RESEARCHPATH AI ASSISTANT</span>
          <h1 id="coach-heading">Research Question Coach</h1>
          <p>
            Your personal research assistant. Ask questions, explore ideas,
            and get guidance throughout your research journey.
          </p>
        </div>
        <div className="research-coach-hero-icon">🤖</div>
      </section>

      <section className="research-coach-panel">
        <div className="research-coach-welcome">
          <div className="research-coach-avatar">🤖</div>
          <div>
            <h2>ResearchPath Assistant</h2>
            <span className="research-coach-online">● Ready to help</span>
          </div>
        </div>

        <div className="research-coach-intro">
          <h3>Hello! Welcome to ResearchPath 👋</h3>
          <p>
            I'm here to help you understand research concepts, improve your
            research questions, and develop your research ideas.
            What would you like to explore today?
          </p>
        </div>

        <div className="research-coach-suggestions">
          <span>TRY ASKING</span>
          <div className="research-coach-prompt-list">
            {[
              "What is a literature review?",
              "Explain research methodology",
              "Help me create a research question",
              "Suggest a research topic",
            ].map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => setIdea(prompt)}
                disabled={loading}
              >
                {prompt} <span>↗</span>
              </button>
            ))}
          </div>
        </div>

        <form className="research-coach-form" onSubmit={handleSubmit}>
          <label htmlFor="idea">Your question or research idea</label>

          <textarea
            id="idea"
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Type your research question here..."
            disabled={loading}
          />

          <div className="research-coach-form-footer">
            <div className="research-coach-language">
              <label htmlFor="language">Response language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
              >
                <option>English</option>
                <option>Kannada</option>
                <option>Hindi</option>
              </select>
            </div>

            <button
              type="submit"
              className="research-coach-send"
              disabled={loading || !idea.trim()}
            >
              {loading ? "Thinking..." : "Get Help →"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="research-coach-loading" role="status">
            <span className="research-coach-dot"></span>
            <span className="research-coach-dot"></span>
            <span className="research-coach-dot"></span>
            <p>Your assistant is thinking...</p>
          </div>
        )}

        {error && (
          <div className="research-coach-error" role="alert">
            {error}
          </div>
        )}

        {result && (
          <section className="research-coach-response" aria-live="polite">
            <div className="research-coach-response-heading">
              <span>🤖</span>
              <div>
                <h2>{isAnswer ? "Assistant's Answer" : "Research Feedback"}</h2>
                <small>ResearchPath AI Response</small>
              </div>
            </div>

            <p className="research-coach-feedback">{result.feedback}</p>

            {!isAnswer && (
              <div className="research-coach-result-section">
                <h3>📊 Evaluation Scores</h3>
                <div className="research-coach-score-grid">
                  {Object.entries(result.scores || {}).map(([name, value]) => (
                    <div className="research-coach-score" key={name}>
                      <span>{name}</span>
                      <strong>{value}/5</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.guiding_question && (
              <div className="research-coach-guiding">
                <h3>💡 Think About This</h3>
                <p>{result.guiding_question}</p>
              </div>
            )}

            <div className="research-coach-result-section">
              <h3>
                ✨ {isAnswer
                  ? "Questions to Explore Next"
                  : "Sharper Questions You Could Ask"}
              </h3>
              <ul>
                {(result.suggestions || []).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
