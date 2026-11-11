import { useState, useEffect } from 'react'

const QUESTIONS = [
  {
    id: 'q1',
    text: 'What is a research question?',
    options: [
      'A question your study tries to answer',
      'A list of references',
      'The title of a paper',
    ],
    answer: 0,
  },
  {
    id: 'q2',
    text: 'Which is the most specific research question?',
    options: [
      'Is sleep good?',
      'How does 8 hours of sleep affect exam scores in college students?',
      'Tell me about sleep.',
    ],
    answer: 1,
  },
  {
    id: 'q3',
    text: 'Why should you cite your sources?',
    options: [
      'To make the paper longer',
      'To give credit and let readers check your claims',
      'It is only needed for books',
    ],
    answer: 1,
  },
]

const BASE_SECONDS = 90

function Quiz() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [calm, setCalm] = useState(false)
  const [extra, setExtra] = useState(false)
  const limit = extra ? BASE_SECONDS * 2 : BASE_SECONDS
  const [left, setLeft] = useState(limit)

  useEffect(() => {
    setLeft(limit)
  }, [limit])

  useEffect(() => {
    if (calm || submitted) return
    const id = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [calm, submitted])

  useEffect(() => {
    if (!calm && !submitted && left <= 0) setSubmitted(true)
  }, [left, calm, submitted])

  const score = QUESTIONS.filter((q) => answers[q.id] === q.answer).length
  const warning = !calm && !submitted && left <= 30 && left > 0 ? 'Less than 30 seconds left.' : ''

  function handleSubmit() {
    setSubmitted(true)
  }

  function handleRetry() {
    setAnswers({})
    setSubmitted(false)
    setLeft(limit)
  }

  return (
    <>
      <h1 tabIndex="-1">Quiz</h1>

      <fieldset>
        <legend>Quiz settings</legend>
        <label>
          <input type="checkbox" checked={calm} onChange={(e) => setCalm(e.target.checked)} disabled={submitted} />
          Calm mode (no timer)
        </label>
        <label>
          <input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} disabled={submitted || calm} />
          Extra time (double)
        </label>
      </fieldset>

      {!calm && !submitted && (
        <p>
          Time left: {Math.floor(left / 60)}:{String(Math.max(left, 0) % 60).padStart(2, '0')}
        </p>
      )}
      <p role="status">{warning}</p>

      {QUESTIONS.map((q, qi) => (
        <fieldset key={q.id} disabled={submitted}>
          <legend>
            Question {qi + 1} of {QUESTIONS.length}: {q.text}
          </legend>
          {q.options.map((opt, oi) => (
            <label key={opt}>
              <input
                type="radio"
                name={q.id}
                checked={answers[q.id] === oi}
                onChange={() => setAnswers({ ...answers, [q.id]: oi })}
              />
              {opt}
            </label>
          ))}
        </fieldset>
      ))}

      {!submitted ? (
        <button type="button" onClick={handleSubmit}>
          Submit answers
        </button>
      ) : (
        <>
          <p role="status">
            You got {score} out of {QUESTIONS.length} correct.
          </p>
          <ul>
            {QUESTIONS.map((q, qi) => (
              <li key={q.id}>
                Question {qi + 1}: {answers[q.id] === q.answer ? 'Correct' : `Incorrect. Right answer: ${q.options[q.answer]}`}
              </li>
            ))}
          </ul>
          <button type="button" onClick={handleRetry}>
            Try again
          </button>
        </>
      )}
    </>
  )
}

export default Quiz