import { useState, useEffect } from 'react'
import { coach, addNote, getNotes, addSource, getSources } from '../backendApi'

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
        setStatus('Could not load saved notes and sources. Is the backend running?')
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
      setStatus('Note saved.')
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
      setStatus('Source saved.')
    } catch {
      setStatus('Could not save the source. Is the backend running?')
    }
  }

  const isAnswer = result?.type === 'answer'

  return (
    <>
      <h1 tabIndex="-1">Workspace</h1>
      <p>Write your research question and ask the coach for feedback.</p>

      <section aria-labelledby="question-heading">
        <h2 id="question-heading">Your research question</h2>
        <form onSubmit={handleAsk}>
          <label htmlFor="question">Your research question</label>
          <textarea
            id="question"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: How does sleep affect memory in students?"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Ask coach'}
          </button>
        </form>

        <div aria-live="polite">
          {loading && <p>The coach is thinking, please wait.</p>}
          {error && <p role="alert">{error}</p>}
          {result && (
            <div>
              <h3>Coach feedback</h3>
              <p>{result.feedback}</p>
              {!isAnswer && (
                <ul>
                  {Object.entries(result.scores || {}).map(([name, value]) => (
                    <li key={name}>
                      {name}: {value} out of 5
                    </li>
                  ))}
                </ul>
              )}
              {result.guiding_question && (
                <>
                  <h3>Think about this</h3>
                  <p>{result.guiding_question}</p>
                </>
              )}
              <h3>Suggestions</h3>
              <ul>
                {(result.suggestions || []).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="notes-heading">
        <h2 id="notes-heading">Notes</h2>
        <form onSubmit={handleAddNote}>
          <label htmlFor="note">Add a note</label>
          <textarea
            id="note"
            rows={2}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <button type="submit">Save note</button>
        </form>
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          <ul>
            {notes.map((n) => (
              <li key={n.id}>{n.text}</li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="sources-heading">
        <h2 id="sources-heading">Source tracker</h2>
        <form onSubmit={handleAddSource}>
          <label htmlFor="source-title">Source title</label>
          <input
            id="source-title"
            type="text"
            value={sourceTitle}
            onChange={(e) => setSourceTitle(e.target.value)}
          />
          <label htmlFor="source-url">Link (optional)</label>
          <input
            id="source-url"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
          <button type="submit">Save source</button>
        </form>
        {sources.length === 0 ? (
          <p>No sources yet.</p>
        ) : (
          <ul>
            {sources.map((s) => (
              <li key={s.id}>
                {s.url ? <a href={s.url}>{s.title}</a> : s.title}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p aria-live="polite" role="status">{status}</p>
    </>
  )
}