
import { useState, useEffect } from 'react'
import {
  coach,
  addNote,
  getNotes,
  addSource,
  getSources,
} from '../backendApi'

const USER_ID = 'asha'

export default function Workspace() {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [notes, setNotes] = useState([])
  const [noteText, setNoteText] = useState('')

  const [sources, setSources] = useState([])
  const [sourceTitle, setSourceTitle] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  const [status, setStatus] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setNotes(await getNotes(USER_ID))
        setSources(await getSources(USER_ID))
      } catch {
        setStatus(
          'Could not load saved notes and sources. Is the backend running?'
        )
      }
    }

    load()
  }, [])

  async function handleAsk(e) {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      setResult(await coach(question, 'English'))
    } catch {
      setError('Could not reach the coach. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddNote(e) {
    e.preventDefault()
    if (!noteText.trim()) return

    try {
      await addNote(USER_ID, noteText)
      setNotes(await getNotes(USER_ID))
      setNoteText('')
      setStatus('Note saved successfully.')
    } catch {
      setStatus('Could not save the note. Is the backend running?')
    }
  }

  async function handleAddSource(e) {
    e.preventDefault()
    if (!sourceTitle.trim()) return

    try {
      await addSource(USER_ID, sourceTitle, sourceUrl)
      setSources(await getSources(USER_ID))
      setSourceTitle('')
      setSourceUrl('')
      setStatus('Source saved successfully.')
    } catch {
      setStatus('Could not save the source. Is the backend running?')
    }
  }

  const isAnswer = result?.type === 'answer'

  return (
    <div className="workspace-page">

      {/* Page heading */}
      <div className="workspace-heading">
        <span className="workspace-tag">YOUR RESEARCH SPACE</span>
        <h1 tabIndex="-1">Research Workspace</h1>
        <p>
          Organize your thoughts, improve your research questions
          and keep all your important research materials in one place.
        </p>
      </div>

      {/* Introduction cards */}
      <div className="workspace-overview">
        <div className="overview-card">
          <span className="workspace-icon">💡</span>
          <h3>Develop Ideas</h3>
          <p>Turn your interests into meaningful research questions.</p>
        </div>

        <div className="overview-card">
          <span className="workspace-icon">📝</span>
          <h3>Organize Notes</h3>
          <p>Keep your important observations and research notes.</p>
        </div>

        <div className="overview-card">
          <span className="workspace-icon">📚</span>
          <h3>Track Sources</h3>
          <p>Save useful research references for future use.</p>
        </div>
      </div>

      {/* Research question section */}
      <section className="workspace-card" aria-labelledby="question-heading">

        <div className="workspace-section-heading">
          <span className="workspace-icon">🎯</span>
          <div>
            <h2 id="question-heading">Research Question</h2>
            <p>
              Have a research idea? Write your question and get
              helpful feedback from your Research Coach.
            </p>
          </div>
        </div>

        <form onSubmit={handleAsk} className="workspace-form">
          <label htmlFor="question">Your research question</label>

          <textarea
            id="question"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: How does sleep affect memory in students?"
            required
          />

          <button
            type="submit"
            className="workspace-button"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Ask Research Coach →'}
          </button>
        </form>

        <div aria-live="polite" className="coach-result">

          {loading && (
            <p className="workspace-message">
              Your Research Coach is preparing feedback. Please wait...
            </p>
          )}

          {error && <p className="workspace-error" role="alert">{error}</p>}

          {result && (
            <div className="feedback-card">
              <h3>💬 Coach Feedback</h3>
              <p>{result.feedback}</p>

              {!isAnswer && (
                <>
                  <h4>Research Question Evaluation</h4>
                  <ul>
                    {Object.entries(result.scores || {}).map(
                      ([name, value]) => (
                        <li key={name}>
                          <strong>{name}:</strong> {value} out of 5
                        </li>
                      )
                    )}
                  </ul>
                </>
              )}

              {result.guiding_question && (
                <>
                  <h4>Think About This</h4>
                  <p>{result.guiding_question}</p>
                </>
              )}

              <h4>Suggestions for Improvement</h4>
              <ul>
                {(result.suggestions || []).map((suggestion, index) => (
                  <li key={`${index}-${suggestion}`}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Notes section */}
      <section className="workspace-card" aria-labelledby="notes-heading">

        <div className="workspace-section-heading">
          <span className="workspace-icon">📒</span>
          <div>
            <h2 id="notes-heading">My Research Notes</h2>
            <p>
              Write down your ideas, observations and important
              information related to your research.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddNote} className="workspace-form">
          <label htmlFor="note">Write a new note</label>

          <textarea
            id="note"
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Start writing your research notes here..."
            required
          />

          <button type="submit" className="workspace-button">
            + Save Note
          </button>
        </form>

        <div className="saved-items">
          <h3>Saved Notes ({notes.length})</h3>

          {notes.length === 0 ? (
            <p className="empty-message">
              No notes yet. Your saved notes will appear here.
            </p>
          ) : (
            <div className="saved-list">
              {notes.map((n) => (
                <div className="saved-item" key={n.id}>
                  <span>📝</span>
                  <p>{n.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sources section */}
      <section className="workspace-card" aria-labelledby="sources-heading">

        <div className="workspace-section-heading">
          <span className="workspace-icon">📚</span>
          <div>
            <h2 id="sources-heading">Research Source Tracker</h2>
            <p>
              Save the books, research papers, articles and websites
              that you refer to during your research.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddSource} className="workspace-form">

          <label htmlFor="source-title">Source title</label>
          <input
            id="source-title"
            type="text"
            value={sourceTitle}
            onChange={(e) => setSourceTitle(e.target.value)}
            placeholder="Example: Research Methodology Journal"
            required
          />

          <label htmlFor="source-url">Source link (optional)</label>
          <input
            id="source-url"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://example.com"
          />

          <button type="submit" className="workspace-button">
            + Save Source
          </button>
        </form>

        <div className="saved-items">
          <h3>Saved Sources ({sources.length})</h3>

          {sources.length === 0 ? (
            <p className="empty-message">
              No sources added yet. Your research references will appear here.
            </p>
          ) : (
            <div className="saved-list">
              {sources.map((s) => (
                <div className="saved-item" key={s.id}>
                  <span>📖</span>
                  <p>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Status message */}
      <p aria-live="polite" role="status" className="workspace-status">
        {status}
      </p>

    </div>
  )
}
