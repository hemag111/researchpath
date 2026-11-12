
import { useState, useEffect } from 'react'
import { getLearners, sendMentorMessage } from '../api'
import '../App.css'

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
    if (!learnerId || !message.trim()) return

    setSending(true)
    setStatus('')
    setSendError('')

    try {
      await sendMentorMessage({
        learnerId,
        message: message.trim(),
      })

      const learner = learners.find(
        (l) => String(l.id) === learnerId
      )

      setStatus(`Message sent to ${learner ? learner.name : 'learner'}.`)
      setMessage('')
    } catch (err) {
      setSendError(err.message || 'Could not send the message.')
    } finally {
      setSending(false)
    }
  }

  const learnersNeedingHelp = learners.filter(
    (learner) => learner.needsHelp
  ).length

  return (
    <main className="mentor-page">
      <section className="mentor-hero">
        <div>
          <span className="mentor-eyebrow">RESEARCHPATH • MENTOR SPACE</span>
          <h1>Mentor Dashboard</h1>
          <p>
            Support learners, monitor their research progress,
            and guide them throughout their learning journey.
          </p>
        </div>

        <div className="mentor-hero-icon">👩‍🏫</div>
      </section>

      <section className="mentor-stats">
        <div className="mentor-stat-card">
          <span className="mentor-stat-icon">👥</span>
          <div>
            <strong>{loading ? '—' : learners.length}</strong>
            <span>Total Learners</span>
          </div>
        </div>

        <div className="mentor-stat-card">
          <span className="mentor-stat-icon">🙋</span>
          <div>
            <strong>{loading ? '—' : learnersNeedingHelp}</strong>
            <span>Need Assistance</span>
          </div>
        </div>

        <div className="mentor-stat-card">
          <span className="mentor-stat-icon">📈</span>
          <div>
            <strong>
              {loading || learners.length === 0
                ? '—'
                : `${Math.round(
                    learners.reduce(
                      (sum, learner) => sum + (Number(learner.progress) || 0),
                      0
                    ) / learners.length
                  )}%`}
            </strong>
            <span>Average Progress</span>
          </div>
        </div>
      </section>

      <section className="mentor-learners-card">
        <div className="mentor-section-heading">
          <div>
            <h2>Learner Overview</h2>
            <p>Track learning progress and identify learners who need support.</p>
          </div>
          <span className="mentor-section-icon">📋</span>
        </div>

        {loading && (
          <p className="mentor-info-message" role="status">
            Loading learners...
          </p>
        )}

        {loadError && (
          <p className="mentor-error-message" role="alert">
            {loadError}
          </p>
        )}

        {!loading && !loadError && learners.length === 0 && (
          <p className="mentor-info-message">
            No learners are available at the moment.
          </p>
        )}

        {!loading && !loadError && learners.length > 0 && (
          <div className="mentor-table-wrapper">
            <table className="mentor-table">
              <caption>Learner progress overview</caption>
              <thead>
                <tr>
                  <th scope="col">Learner</th>
                  <th scope="col">Current Module</th>
                  <th scope="col">Progress</th>
                  <th scope="col">Support Status</th>
                </tr>
              </thead>

              <tbody>
                {learners.map((learner) => (
                  <tr key={learner.id}>
                    <th scope="row">{learner.name}</th>

                    <td>{learner.module}</td>

                    <td>
                      <div className="mentor-progress-cell">
                        <div className="mentor-progress-track">
                          <div
                            className="mentor-progress-fill"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, Number(learner.progress) || 0)
                              )}%`,
                            }}
                          />
                        </div>
                        <span>{learner.progress}%</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`mentor-status ${
                          learner.needsHelp
                            ? 'mentor-status-help'
                            : 'mentor-status-good'
                        }`}
                      >
                        {learner.needsHelp
                          ? 'Needs Help'
                          : 'On Track'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mentor-feedback-card">
        <div className="mentor-section-heading">
          <div>
            <h2>Send Personalised Feedback</h2>
            <p>
              Share suggestions, encouragement, and guidance with learners.
            </p>
          </div>
          <span className="mentor-section-icon">💬</span>
        </div>

        <div className="mentor-form">
          <label htmlFor="mentor-learner">Select Learner</label>

          <select
            id="mentor-learner"
            value={learnerId}
            onChange={(e) => setLearnerId(e.target.value)}
            disabled={loading || !!loadError || learners.length === 0 || sending}
          >
            <option value="">Choose a learner</option>
            {learners.map((learner) => (
              <option key={learner.id} value={learner.id}>
                {learner.name}
              </option>
            ))}
          </select>

          <label htmlFor="mentor-message">Your Feedback</label>

          <textarea
            id="mentor-message"
            rows="5"
            placeholder="Write your feedback or guidance here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending}
          />

          <div className="mentor-form-footer">
            <span>{message.length} characters</span>

            <button
              type="button"
              className="mentor-send-button"
              onClick={handleSend}
              disabled={
                sending ||
                !learnerId ||
                !message.trim() ||
                loading ||
                !!loadError
              }
            >
              {sending ? 'Sending...' : 'Send Feedback →'}
            </button>
          </div>

          <div aria-live="polite">
            {status && (
              <p className="mentor-success-message">{status}</p>
            )}
            {sendError && (
              <p className="mentor-error-message" role="alert">
                {sendError}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Mentor
