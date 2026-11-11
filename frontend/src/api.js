const USE_MOCK = true
const API_URL = 'http://localhost:8000'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function askCoach({ question }) {
  if (!question.trim()) {
    throw new Error('Please type a question first.')
  }

  if (!USE_MOCK) {
    const res = await fetch(`${API_URL}/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    })
    if (!res.ok) throw new Error('The coach could not answer. Please try again.')
    return res.json() // { feedback, suggestions[] }
  }

  await wait(700)
  const words = question.trim().split(/\s+/).length
  const suggestions = []
  if (words < 8) suggestions.push('Add more detail so the question is specific.')
  if (!/[?]$/.test(question.trim())) suggestions.push('End with a question mark so the ask is clear.')
  if (!/\b(why|how|what|which|when|compare)\b/i.test(question)) {
    suggestions.push('Start with why, how, what or which to focus the question.')
  }
  if (suggestions.length === 0) {
    suggestions.push('Name the method or dataset you are working with.')
  }

  return {
    feedback:
      words < 8
        ? 'Your question is a good start, but it is quite short.'
        : 'This is a clear research question. A few small changes will make it stronger.',
    suggestions,
  }
}
export async function getLearners() {
  await wait(400)
  return [
    { id: 1, name: 'Asha', module: 'Module 2', progress: 60, needsHelp: true },
    { id: 2, name: 'Ravi', module: 'Module 1', progress: 90, needsHelp: false },
    { id: 3, name: 'Meena', module: 'Module 3', progress: 35, needsHelp: false },
  ]
}

export async function sendMentorMessage({ learnerId, message }) {
  if (!message.trim()) {
    throw new Error('Please write a message first.')
  }
  await wait(500)
  return { ok: true, learnerId }
}