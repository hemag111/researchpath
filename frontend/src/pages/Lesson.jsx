
import { useState, useRef, useEffect } from 'react'
import { LESSON } from '../lessons'
import { getProgress, setProgress } from '../backendApi'

const USER_ID = 'demo-asha'

const FORMATS = [
  { key: 'text', label: 'Text', icon: '📖' },
  { key: 'simple', label: 'Simple language', icon: '💡' },
  { key: 'audio', label: 'Audio', icon: '🔊' },
  { key: 'video', label: 'Video', icon: '🎬' },
]

const AUDIO_SUPPORTED =
  typeof window !== 'undefined' && 'speechSynthesis' in window

function Lesson() {
  const [part, setPart] = useState(0)
  const [format, setFormat] = useState('text')
  const [audioMsg, setAudioMsg] = useState('')
  const [videoError, setVideoError] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const utteranceRef = useRef(null)

  const total = LESSON.parts.length
  const current = LESSON.parts[part]
  const isFirst = part === 0
  const isLast = part === total - 1
  const progress = ((part + 1) / total) * 100

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getProgress(USER_ID)
        setCompleted(data.completed_modules.includes(2))
      } catch {
        setError('Could not load your progress. Please check the backend.')
      } finally {
        setLoading(false)
      }
    }

    loadProgress()

    return () => {
      if (AUDIO_SUPPORTED) window.speechSynthesis.cancel()
    }
  }, [])

  function stopSpeech(message = '') {
    utteranceRef.current = null

    if (AUDIO_SUPPORTED) {
      window.speechSynthesis.cancel()
    }

    setAudioMsg(message)
  }

  function play() {
    stopSpeech()

    if (!AUDIO_SUPPORTED) {
      setAudioMsg('Audio is not supported in this browser.')
      return
    }

    const u = new SpeechSynthesisUtterance(current.text)
    u.lang = 'en'

    u.onend = () => {
      if (utteranceRef.current === u) {
        setAudioMsg('Audio finished.')
      }
    }

    u.onerror = (e) => {
      if (
        utteranceRef.current === u &&
        e.error !== 'canceled' &&
        e.error !== 'interrupted'
      ) {
        setAudioMsg('Audio could not play. Please read the transcript.')
      }
    }

    utteranceRef.current = u
    window.speechSynthesis.speak(u)
    setAudioMsg('Playing audio.')
  }

  function changeFormat(key) {
    stopSpeech()
    setVideoError(false)
    setFormat(key)
  }

  function goPrevious() {
    if (isFirst) return
    stopSpeech()
    setPart(part - 1)
  }

  function goNext() {
    if (isLast) return
    stopSpeech()
    setPart(part + 1)
  }

  async function markCompleted() {
    setSaving(true)
    setError('')

    try {
      await setProgress(USER_ID, 2, true)
      setCompleted(true)
    } catch {
      setError('Unable to save progress. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="lesson-page">
      <div className="lesson-hero">
        <span className="lesson-eyebrow">RESEARCHPATH LEARNING</span>
        <h1 tabIndex="-1">{LESSON.title}</h1>
        <p>
          Learn at your own pace. Read, listen or watch the lesson
          in the format that works best for you.
        </p>
      </div>

      <div className="lesson-progress-card">
        <div className="lesson-progress-heading">
          <div>
            <h2>Your lesson progress</h2>
            <p>Complete each part to finish this module.</p>
          </div>
          <strong>{Math.round(progress)}%</strong>
        </div>

        <div
          className="lesson-progress-track"
          role="progressbar"
          aria-label="Lesson part progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="lesson-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="lesson-progress-caption">
          Part {part + 1} of {total}
        </p>
      </div>

      <div className="lesson-format-section">
        <h2>Choose your learning format</h2>
        <p>Select how you would like to learn this lesson.</p>

        <div className="lesson-format-grid" role="group" aria-label="Lesson format">
          {FORMATS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`lesson-format-button ${format === f.key ? 'active' : ''}`}
              aria-pressed={format === f.key}
              onClick={() => changeFormat(f.key)}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <article className="lesson-content-card">
        <div className="lesson-content-heading">
          <span>PART {String(part + 1).padStart(2, '0')}</span>
          <span>{format === 'audio' ? '🔊 Audio lesson' :
            format === 'video' ? '🎬 Video lesson' :
            format === 'simple' ? '💡 Simple explanation' : '📖 Reading lesson'}</span>
        </div>

        <h2>{current.title}</h2>

        {format === 'audio' && (
          <div className="lesson-media-panel">
            <h3>Listen to the lesson</h3>
            <p>Use the controls to listen to the lesson narration.</p>

            {AUDIO_SUPPORTED ? (
              <div className="lesson-media-controls">
                <button type="button" onClick={play}>
                  ▶ Play audio
                </button>
                <button
                  type="button"
                  className="lesson-secondary-button"
                  onClick={() => stopSpeech('Audio stopped.')}
                >
                  ■ Stop audio
                </button>
              </div>
            ) : (
              <p>Audio is not supported in this browser. Please read the transcript.</p>
            )}

            <p className="lesson-media-status" role="status">{audioMsg}</p>

            <div className="lesson-transcript">
              <h3>Audio transcript</h3>
              <p>{current.text}</p>
            </div>
          </div>
        )}

        {format === 'video' && (
          <div className="lesson-media-panel">
            <h3>Watch the lesson</h3>

            {videoError ? (
              <p role="alert">
                The video could not be loaded. Please read the transcript below.
              </p>
            ) : (
              <video
                key={part}
                className="lesson-video"
                controls
                preload="metadata"
                onError={() => setVideoError(true)}
              >
                <source src="/lesson.mp4" type="video/mp4" />
                <track
                  kind="captions"
                  src="/captions.vtt"
                  srcLang="en"
                  label="English"
                  default
                />
                Your browser does not support video.
              </video>
            )}

            <div className="lesson-transcript">
              <h3>Video transcript</h3>
              <p>{current.text}</p>
            </div>
          </div>
        )}

        {format === 'text' && (
          <div className="lesson-reading-text">
            <p>{current.text}</p>
          </div>
        )}

        {format === 'simple' && (
          <div className="lesson-reading-text">
            <p>{current.simple}</p>
          </div>
        )}
      </article>

      <div className="lesson-navigation">
        <button
          type="button"
          className="lesson-secondary-button"
          disabled={isFirst}
          onClick={goPrevious}
        >
          ← Previous part
        </button>

        <p aria-live="polite">
          {part + 1} / {total}
        </p>

        <button
          type="button"
          disabled={isLast}
          onClick={goNext}
        >
          Next part →
        </button>
      </div>

      {isLast && (
        <section className="lesson-completion-card">
          <span className="lesson-completion-icon">🏆</span>
          <div>
            <h2>You've reached the final part!</h2>
            <p>Complete this module to save your learning progress.</p>
          </div>

          {loading ? (
            <p>Loading your progress...</p>
          ) : completed ? (
            <p className="lesson-completed-message" role="status">
              ✓ Module 2 completed successfully!
            </p>
          ) : (
            <button
              type="button"
              onClick={markCompleted}
              disabled={saving}
            >
              {saving ? 'Saving...' : '✓ Mark Module as Completed'}
            </button>
          )}
        </section>
      )}

      {error && <p className="lesson-error" role="alert">{error}</p>}
    </section>
  )
}

export default Lesson
