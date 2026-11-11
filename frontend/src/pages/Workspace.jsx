import { useState } from 'react'
import { askCoach } from '../api'

function Workspace() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  async function handleAsk() {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await askCoach({ question })
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 tabIndex="-1">Workspace</h1>
      <p>Write your research question and ask the coach for feedback.</p>

      <label htmlFor="question">Your research question</label>
      <textarea
        id="question"
        rows="4"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        aria-describedby="question-help"
      />
      <p id="question-help">Example: How does sleep affect memory in students?</p>

      <button type="button" onClick={handleAsk} disabled={loading}>
        {loading ? 'Asking coach...' : 'Ask coach'}
      </button>

      <div aria-live="polite" className="coach-output">
        {loading && <p>The coach is reading your question...</p>}
        {error && <p role="alert">{error}</p>}
        {result && (
          <section aria-labelledby="coach-title">
            <h2 id="coach-title">Coach feedback</h2>
            <p>{result.feedback}</p>
            <h3>Suggestions</h3>
            <ul>
              {result.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}

export default Workspace