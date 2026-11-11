import { useState, useEffect } from 'react'
import { getLearners, sendMentorMessage } from '../api'

function Mentor() {
  const [learners, setLearners] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [learnerId, setLearnerId] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState('')
  const [sendError, setSendError] = useState('')

  useEffect(() => {
    getLearners()
      .then((data) => {
        setLearners(data)
        setLoading(false)
      })
      .catch(() => {
        setLoadError('Could not load learners. Please try again.')
        setLoading(false)
      })
  }, [])

  async function handleSend() {
    setSending(true)
    setStatus('')
    setSendError('')
    try {
      await sendMentorMessage({ learnerId, message })
      const learner = learners.find((l) => String(l.id) === learnerId)
      setStatus(`Message sent to ${learner ? learner.name : 'learner'}.`)
      setMessage('')
    } catch (err) {
      setSendError(err.message || 'Could not send the message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <h1 tabIndex="-1">Mentor</h1>

      <h2>Learners</h2>
      {loading && <p role="status">Loading learners...</p>}
      {loadError && <p role="alert">{loadError}</p>}
      {!loading && !loadError && (
        <table>
          <caption>Learner progress</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Module</th>
              <th scope="col">Progress</th>
              <th scope="col">Needs help</th>
            </tr>
          </thead>
          <tbody>
            {learners.map((l) => (
              <tr key={l.id}>
                <th scope="row">{l.name}</th>
                <td>{l.module}</td>
                <td>{l.progress}%</td>
                <td>{l.needsHelp ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Send feedback</h2>
      <label htmlFor="learner">Learner</label>
      <select id="learner" value={learnerId} onChange={(e) => setLearnerId(e.target.value)}>
        <option value="">Choose a learner</option>
        {learners.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        rows="4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button type="button" onClick={handleSend} disabled={sending || !learnerId}>
        {sending ? 'Sending...' : 'Send message'}
      </button>

      <div aria-live="polite">
        {status && <p>{status}</p>}
        {sendError && <p role="alert">{sendError}</p>}
      </div>
    </>
  )
}

export default Mentor