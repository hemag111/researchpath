
import { useState, useRef, useEffect } from 'react'
import { LESSON } from '../lessons'
import { getProgress, setProgress } from '../backendApi'

const USER_ID = 'demo-asha'

const FORMATS = [
  { key: 'text', label: 'Text' },
  { key: 'simple', label: 'Simple language' },
  { key: 'audio', label: 'Audio' },
  { key: 'video', label: 'Video' },
]

const AUDIO_SUPPORTED = 'speechSynthesis' in window

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
    <>
      <h1 tabIndex="-1">{LESSON.title}</h1>

      <div className="format-switch" role="group" aria-label="Lesson format">
        {FORMATS.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={format === f.key}
            onClick={() => changeFormat(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section aria-labelledby="part-title">
        <h2 id="part-title">{current.title}</h2>

        {format === 'audio' && (
          <>
            {AUDIO_SUPPORTED ? (
              <div className="audio-controls">
                <button type="button" onClick={play}>
                  Play audio
                </button>

                <button
                  type="button"
                  onClick={() => stopSpeech('Audio stopped.')}
                >
                  Stop audio
                </button>
              </div>
            ) : (
              <p>
                Audio is not supported in this browser.
                Please read the transcript below.
              </p>
            )}

            <p role="status">{audioMsg}</p>

            <h3>Transcript</h3>
            <p>{current.text}</p>
          </>
        )}

        {format === 'video' && (
          <>
            {videoError ? (
              <p role="alert">
                The video could not be loaded.
                Please read the transcript below.
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
                Please read the transcript below.
              </video>
            )}

            <h3>Transcript</h3>
            <p>{current.text}</p>
          </>
        )}

        {(format === 'text' || format === 'simple') && (
          <p>{current[format]}</p>
        )}
      </section>

      <div className="lesson-controls">
        <button
          type="button"
          disabled={isFirst}
          onClick={goPrevious}
        >
          Previous part
        </button>

        <p role="status">
          Part {part + 1} of {total}: {current.title}
        </p>

        <button
          type="button"
          disabled={isLast}
          onClick={goNext}
        >
          Next part
        </button>
      </div>

      {isLast && (
        <section className="completion-section">
          <h2>Complete Module 2</h2>

          {loading ? (
            <p>Loading your progress...</p>
          ) : completed ? (
            <p role="status">
              Module 2 completed successfully!
            </p>
          ) : (
            <button
              type="button"
              onClick={markCompleted}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Mark Module as Completed'}
            </button>
          )}
        </section>
      )}

      {error && <p role="alert">{error}</p>}
    </>
  )
}

export default Lesson
