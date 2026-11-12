
import { useState, useEffect } from 'react'
import { getProgress, setProgress } from '../backendApi'

const USER_ID = 'demo-asha'

const LESSONS = [
  {
    title: 'Understanding a literature review',
    text: `A literature review is an important part of the research process.

After formulating a research problem, the researcher should study the existing literature related to that problem.

It involves examining earlier studies, concepts, theories and information connected with the selected research topic.

A literature survey helps the researcher understand what has already been studied and what further investigation may be required.`,
    simple: `A literature review means reading and studying the research work that has already been done on your topic.

Before starting a new research project, we should understand what other researchers have already discovered.

This helps us get a clear idea about our topic.`,
  },
  {
    title: 'Sources of literature',
    text: `Researchers can collect literature from different sources.

Important sources include:

1. Academic journals.
2. Indexed journals.
3. Conference proceedings.
4. Published and unpublished bibliographies.
5. Government reports.
6. Books and other relevant publications.

The researcher should select sources depending on the nature of the research problem.`,
    simple: `We can find information about previous research from different places.

Some important sources are:

1. Research journals.
2. Conference papers.
3. Government reports.
4. Books.
5. Published and unpublished research materials.

We should choose sources that are related to our research topic.`,
  },
  {
    title: 'Studying previous research',
    text: `Previous studies related to the selected research problem should be carefully examined.

Researchers should study both conceptual literature and empirical literature.

Conceptual literature explains the concepts and theories related to the topic.

Empirical literature contains information about similar studies conducted earlier.

Studying these materials helps the researcher understand existing knowledge and develop a clearer approach to the problem.`,
    simple: `We should read the research work done by other people on similar topics.

Conceptual literature explains ideas and theories.

Empirical literature gives information about earlier studies based on observations, experiments or collected data.

By studying both, we can understand our research topic better.`,
  },
  {
    title: 'Identifying research gaps',
    text: `A literature survey helps researchers identify gaps in existing knowledge.

By examining earlier studies, researchers can understand what information and materials are already available.

It also helps to narrow down the research problem and identify areas that need further investigation.

Discussions with experienced people and subject experts can help develop new ideas and improve the focus of the research problem.`,
    simple: `A research gap means an area that has not been studied enough or a question that previous research has not fully answered.

By reading earlier research papers, we can find what is missing.

This helps us choose what new work we can do through our research.`,
  },
]

function Module3() {
  const [index, setIndex] = useState(0)
  const [format, setFormat] = useState('text')
  const [audioMessage, setAudioMessage] = useState('')
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const current = LESSONS[index]
  const isLastLesson = index === LESSONS.length - 1

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getProgress(USER_ID)
        setCompleted(data.completed_modules.includes(3))
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
  }, [])

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
      await setProgress(USER_ID, 3, true)
      setCompleted(true)
    } catch {
      setError('Unable to save progress. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h1 tabIndex="-1">Module 3: Literature Review</h1>

      <p>Learn how to study previous research and identify research gaps.</p>

      <p>
        Lesson {index + 1} of {LESSONS.length}
      </p>

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

        <button onClick={() => stopAudio()}>
          Stop audio
        </button>
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
          <h2>Complete Module 3</h2>

          {loading ? (
            <p>Loading your progress...</p>
          ) : completed ? (
            <p role="status">
              Module 3 completed successfully!
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

export default Module3
