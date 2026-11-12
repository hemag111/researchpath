
import { useEffect, useState } from 'react'
import { makeQuiz } from '../backendApi'

import { LESSONS as MODULE1 } from './Module1'
import { LESSON as MODULE2 } from '../lessons'
import { LESSONS as MODULE3 } from './Module3'
import { LESSONS as MODULE4 } from './Module4'
import { LESSONS as MODULE5 } from './Module5'
import { LESSONS as MODULE6 } from './Module6'
import { LESSONS as MODULE7 } from './Module7'

const MODULES = [
  { id: 1, title: 'Module 1: Find a Topic', lessons: MODULE1 },
  { id: 2, title: 'Module 2: Turn Curiosity into a Question', lessons: MODULE2.parts },
  { id: 3, title: 'Module 3: Literature Review', lessons: MODULE3 },
  { id: 4, title: 'Module 4: Choose a Method', lessons: MODULE4 },
  { id: 5, title: 'Module 5: Collect and Analyze Data', lessons: MODULE5 },
  { id: 6, title: 'Module 6: Write and Cite', lessons: MODULE6 },
  { id: 7, title: 'Module 7: Present Research', lessons: MODULE7 },
]

const BASE_SECONDS = 90

function Quiz() {
  const [moduleId, setModuleId] = useState('1')
  const [count, setCount] = useState(5)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [calm, setCalm] = useState(false)
  const [extra, setExtra] = useState(false)
  const [left, setLeft] = useState(BASE_SECONDS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const limit = extra ? BASE_SECONDS * 2 : BASE_SECONDS
  const quizStarted = questions.length > 0
  const selectedModule = MODULES.find((m) => m.id === Number(moduleId))

  const score = questions.filter(
    (q, index) => answers[index] === q.answer_index
  ).length

  const warning =
    !calm && quizStarted && !submitted && left <= 30 && left > 0

  // Start the timer only after questions have been generated.
  useEffect(() => {
    if (!quizStarted || submitted || calm) return

    const timer = setInterval(() => {
      setLeft((seconds) => Math.max(0, seconds - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, submitted, calm])

  // Automatically submit when the timer reaches zero.
  useEffect(() => {
    if (quizStarted && !calm && left <= 0 && !submitted) {
      setSubmitted(true)
    }
  }, [left, calm, submitted, quizStarted])

  async function generateQuiz() {
    if (!selectedModule) return

    const lessonText = selectedModule.lessons
      .map((lesson) => {
        return `Topic: ${lesson.title}\n${lesson.text}\nSimple explanation: ${lesson.simple || ''}`
      })
      .join('\n\n')

    setLoading(true)
    setError('')
    setQuestions([])
    setAnswers({})
    setSubmitted(false)

    try {
      const data = await makeQuiz(lessonText, count)

      if (!data.questions || data.questions.length === 0) {
        throw new Error('The AI did not generate questions. Please try again.')
      }

      setQuestions(data.questions)
      setLeft(limit)
    } catch (err) {
      setError(
        err.message || 'Could not generate the quiz. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  function handleRetry() {
    setAnswers({})
    setSubmitted(false)
    setLeft(limit)
  }

  function handleNewQuiz() {
    setQuestions([])
    setAnswers({})
    setSubmitted(false)
    setError('')
    setLeft(limit)
  }

  return (
    <main className="ai-quiz-page">
      <section className="quiz-hero">
        <div>
          <span className="quiz-eyebrow">RESEARCHPATH • AI LEARNING</span>
          <h1>AI Quiz Generator</h1>
          <p>
            Test your understanding with questions generated from your
            ResearchPath lessons.
          </p>
        </div>
        <div className="quiz-hero-icon" aria-hidden="true">🧠</div>
      </section>

      <section className="quiz-setup">
        <div className="quiz-section-heading">
          <span className="quiz-step">01</span>
          <div>
            <h2>Set up your quiz</h2>
            <p>Choose a module and customize your practice.</p>
          </div>
        </div>

        <div className="quiz-settings-grid">
          <div className="quiz-field">
            <label htmlFor="quiz-module">Select module</label>
            <select
              id="quiz-module"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              disabled={quizStarted || loading}
            >
              {MODULES.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>

          <div className="quiz-field">
            <label htmlFor="quiz-count">Number of questions</label>
            <select
              id="quiz-count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={quizStarted || loading}
            >
              <option value={3}>3 questions</option>
              <option value={5}>5 questions</option>
              <option value={10}>10 questions</option>
            </select>
          </div>
        </div>

        <div className="quiz-mode-options">
          <label className="quiz-option">
            <input
              type="checkbox"
              checked={calm}
              onChange={(e) => setCalm(e.target.checked)}
              disabled={quizStarted || loading}
            />
            <span>
              <strong>Calm mode</strong>
              <small>Practice without a timer</small>
            </span>
          </label>

          <label className="quiz-option">
            <input
              type="checkbox"
              checked={extra}
              onChange={(e) => setExtra(e.target.checked)}
              disabled={quizStarted || loading || calm}
            />
            <span>
              <strong>Extra time</strong>
              <small>Get double the time</small>
            </span>
          </label>
        </div>

        {!quizStarted && (
          <button
            className="quiz-primary-button"
            type="button"
            onClick={generateQuiz}
            disabled={loading}
          >
            {loading ? 'Generating questions...' : '✨ Generate AI Quiz'}
          </button>
        )}

        {loading && (
          <p className="quiz-loading" role="status">
            Your AI coach is preparing questions from the selected module...
          </p>
        )}

        {error && <p className="quiz-error" role="alert">{error}</p>}
      </section>

      {quizStarted && (
        <section className="quiz-question-area">
          <div className="quiz-progress-header">
            <div>
              <span className="quiz-step">02</span>
              <h2>Your questions</h2>
              <p>{selectedModule?.title}</p>
            </div>

            {!calm && !submitted && (
              <div className={`quiz-timer ${warning ? 'quiz-timer-warning' : ''}`}>
                <span>TIME LEFT</span>
                <strong>
                  {Math.floor(left / 60)}:
                  {String(left % 60).padStart(2, '0')}
                </strong>
              </div>
            )}

            {calm && (
              <div className="quiz-timer">
                <span>CALM MODE</span>
                <strong>∞</strong>
              </div>
            )}
          </div>

          {warning && (
            <p className="quiz-warning" role="status">
              Less than 30 seconds left. Keep going!
            </p>
          )}

          {questions.map((question, index) => (
            <fieldset
              className="quiz-question-card"
              key={index}
              disabled={submitted}
            >
              <legend>
                <span className="quiz-question-number">
                  QUESTION {index + 1}
                </span>
                <strong>{question.question}</strong>
              </legend>

              <div className="quiz-options-list">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[index] === optionIndex
                  const correct = question.answer_index === optionIndex

                  let optionClass = ''
                  if (submitted && correct) optionClass = 'option-correct'
                  else if (submitted && selected && !correct) {
                    optionClass = 'option-incorrect'
                  } else if (selected) {
                    optionClass = 'option-selected'
                  }

                  return (
                    <label className={`quiz-answer-option ${optionClass}`} key={optionIndex}>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={selected}
                        onChange={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [index]: optionIndex,
                          }))
                        }
                      />
                      <span className="quiz-option-letter">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span>{option}</span>
                    </label>
                  )
                })}
              </div>

              {submitted && (
                <div className="quiz-explanation">
                  <strong>
                    {answers[index] === question.answer_index
                      ? '✓ Correct answer'
                      : '✗ Correct answer: ' +
                        question.options[question.answer_index]}
                  </strong>
                  <p>{question.explanation}</p>
                </div>
              )}
            </fieldset>
          ))}

          {!submitted ? (
            <button
              className="quiz-primary-button"
              type="button"
              onClick={handleSubmit}
            >
              Submit answers
            </button>
          ) : (
            <section className="quiz-result-card" aria-live="polite">
              <span className="quiz-step">03</span>
              <h2>Quiz completed!</h2>
              <div className="quiz-score">
                {score} <span>/ {questions.length}</span>
              </div>
              <p>
                {score === questions.length
                  ? 'Excellent work! You answered every question correctly.'
                  : score >= questions.length / 2
                    ? 'Good effort! Review the explanations to improve further.'
                    : 'Keep practising! Revisit the lesson and try again.'}
              </p>

              <div className="quiz-result-actions">
                <button
                  className="quiz-primary-button"
                  type="button"
                  onClick={handleRetry}
                >
                  Try again
                </button>
                <button
                  className="quiz-secondary-button"
                  type="button"
                  onClick={handleNewQuiz}
                >
                  Generate another quiz
                </button>
              </div>
            </section>
          )}
        </section>
      )}
    </main>
  )
}

export default Quiz
