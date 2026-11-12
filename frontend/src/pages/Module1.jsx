
import { useState, useEffect } from 'react'
import { getProgress, setProgress } from '../backendApi'

const USER_ID = 'demo-asha'

export const LESSONS = [
  {
    title: 'Understanding the meaning of research',
    text: `Research is a scientific and systematic search for appropriate information on a specific topic.

It is an original contribution to existing knowledge.

Research involves defining a problem, formulating a hypothesis, collecting and organizing data, analyzing the data, making deductions, reaching conclusions and testing those conclusions.`,
    simple: `Research means finding information about a particular topic in a systematic way.

It helps us discover new things and improve existing knowledge.

For example, studying how students use online learning platforms is a research activity.`,
  },
  {
    title: 'Objectives of research',
    text: `The main aim of research is to discover hidden truths that have not been discovered yet.

The four important objectives are:

1. Exploratory research: To gain new insights into a phenomenon.
2. Descriptive research: To describe the characteristics of a person, group or situation.
3. Diagnostic research: To determine how frequently something occurs.
4. Hypothesis-testing research: To test a proposed relationship between variables.`,
    simple: `Research helps us understand things better.

1. Exploratory: Discover something new.
2. Descriptive: Describe something.
3. Diagnostic: Find how often something happens.
4. Hypothesis-testing: Check whether an idea or relationship is true.`,
  },
  {
    title: 'Motivation in research',
    text: `People conduct research for different reasons.

Important motivations include:

1. Desire to obtain a research degree.
2. Interest in solving practical problems.
3. Enjoyment of creative and intellectual work.
4. Desire to serve society.
5. Desire to gain respect and recognition.

Other motivations include curiosity, government directions, employment conditions and understanding relationships between events.`,
    simple: `People do research for many reasons.

They may want to solve problems, learn new things, help society, earn a research degree or develop creative ideas.

Curiosity is also an important reason for doing research.`,
  },
  {
    title: 'Types of research',
    text: `Research can be classified into different types:

1. Descriptive research: Describes the current situation.
2. Analytical research: Uses existing information to make a critical evaluation.
3. Fundamental research: Develops theories and adds to scientific knowledge.
4. Applied research: Solves practical problems.
5. Quantitative research: Deals with numbers and measurements.
6. Qualitative research: Deals with qualities, opinions and experiences.
7. Conceptual research: Develops or explains ideas and theories.
8. Empirical research: Uses observations or experiments and data.`,
    simple: `There are different ways to conduct research.

Some research describes a situation. Some studies existing information.

Some research develops new theories, while applied research solves real problems.

Quantitative research uses numbers. Qualitative research studies opinions, experiences and qualities.`,
  },
]

function Module1() {
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
        setCompleted(data.completed_modules.includes(1))
      } catch {
        setError('Could not load your progress. Please check the backend.')
      } finally {
        setLoading(false)
      }
    }

    loadProgress()

    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  function stopAudio() {
    window.speechSynthesis?.cancel()
    setAudioMessage('Audio stopped.')
  }

  function playAudio() {
    stopAudio()

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
    stopAudio()
    setIndex(next)
    setFormat('text')
  }

  async function markCompleted() {
    setSaving(true)
    setError('')

    try {
      await setProgress(USER_ID, 1, true)
      setCompleted(true)
    } catch {
      setError('Unable to save progress. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h1 tabIndex="-1">Module 1: Find a Topic</h1>

      <p>Learn the basics of research step by step.</p>

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
        <button onClick={stopAudio}>Stop audio</button>
      </div>

      <section>
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
        <div className="completion-section">
          <h2>Complete Module 1</h2>

          {loading ? (
            <p>Loading your progress...</p>
          ) : completed ? (
            <p role="status">
              Module 1 completed successfully!
            </p>
          ) : (
            <button
              onClick={markCompleted}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Mark Module as Completed'}
            </button>
          )}
        </div>
      )}

      {error && <p role="alert">{error}</p>}
    </section>
  )
}

export default Module1
