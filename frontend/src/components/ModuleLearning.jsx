
import { useEffect, useState } from 'react'
import { getProgress, setProgress } from '../backendApi'

const USER_ID = 'demo-asha'

function ModuleLearning({ moduleNumber, title, description, lessons }) {
  const [index, setIndex] = useState(0)
  const [format, setFormat] = useState('text')
  const [audioMessage, setAudioMessage] = useState('')
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const current = lessons[index]
  const isLastLesson = index === lessons.length - 1

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getProgress(USER_ID)
        setCompleted(data.completed_modules.includes(moduleNumber))
      } catch {
        setError('Could not load your progress. Please check the backend.')
      } finally {
        setLoading(false)
      }
    }

    loadProgress()

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [moduleNumber])

  function stopAudio(message = 'Audio stopped.') {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setAudioMessage(message)
  }

  function playAudio() {
    stopAudio('')

    if (!('speechSynthesis' in window)) {
      setAudioMessage('Audio is not supported in this browser.')
      return
    }

    const speech = new SpeechSynthesisUtterance(current.text)
    speech.lang = 'en-IN'
    speech.onend = () => setAudioMessage('Audio finished.')

    window.speechSynthesis.speak(speech)
    setAudioMessage('Playing audio...')
  }

  function changeLesson(next) {
    stopAudio('')
    setIndex(next)
    setFormat('text')
  }

  async function markCompleted() {
    setSaving(true)
    setError('')

    try {
      await setProgress(USER_ID, moduleNumber, true)
      setCompleted(true)
    } catch {
      setError('Unable to save progress. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h1 tabIndex="-1">Module {moduleNumber}: {title}</h1>

      <p>{description}</p>
      <p>Lesson {index + 1} of {lessons.length}</p>

      <div
        className="format-switch"
        role="group"
        aria-label="Lesson format"
      >
        <button
          onClick={() => setFormat('text')}
          aria-pressed={format === 'text'}
        >
          Text
        </button>

        <button
          onClick={() => setFormat('simple')}
          aria-pressed={format === 'simple'}
        >
          Simple language
        </button>

        <button onClick={playAudio}>Play audio</button>
        <button onClick={() => stopAudio()}>Stop audio</button>
      </div>

      <section aria-live="polite">
        <h2>{current.title}</h2>

        <p style={{ whiteSpace: 'pre-line' }}>
          {format === 'simple' ? current.simple : current.text}
        </p>

        <p role="status">{audioMessage}</p>
      </section>

      <div className="lesson-controls">
        <button
          disabled={index === 0}
          onClick={() => changeLesson(index - 1)}
        >
          Previous lesson
        </button>

        <button
          disabled={isLastLesson}
          onClick={() => changeLesson(index + 1)}
        >
          Next lesson
        </button>
      </div>

      {isLastLesson && (
        <section className="completion-section">
          <h2>Complete Module {moduleNumber}</h2>

          {loading ? (
            <p>Loading your progress...</p>
          ) : completed ? (
            <p role="status">
              Module {moduleNumber} completed successfully!
            </p>
          ) : (
            <button
              onClick={markCompleted}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Mark Module as Completed'}
            </button>
          )}
        </section>
      )}

      {error && <p role="alert">{error}</p>}
    </section>
  )
}

export default ModuleLearning
