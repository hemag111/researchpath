
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProgress } from '../backendApi'

const USER_ID = 'demo-asha'

const modules = [
  { id: 1, name: 'Find a Topic', path: '/module-1', icon: '💡' },
  { id: 2, name: 'Ask a Question', path: '/lesson', icon: '❓' },
  { id: 3, name: 'Literature Review', path: '/module-3', icon: '📚' },
  { id: 4, name: 'Choose a Method', path: '/module-4', icon: '🔬' },
  { id: 5, name: 'Collect and Analyze Data', path: '/module-5', icon: '📊' },
  { id: 6, name: 'Write and Cite', path: '/module-6', icon: '📝' },
  { id: 7, name: 'Present', path: '/module-7', icon: '🎯' },
]

function Dashboard() {
  const [completedModules, setCompletedModules] = useState([])
  const [percent, setPercent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await getProgress(USER_ID)
        setCompletedModules(data.completed_modules || [])
        setPercent(data.percent || 0)
      } catch {
        setError('Unable to load your learning progress. Please check the backend.')
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  const completedCount = completedModules.length
  const nextModule = modules.find(
    module => !completedModules.includes(module.id)
  )

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">YOUR LEARNING JOURNEY</span>
          <h1 tabIndex="-1">Welcome back, Asha! 👋</h1>
          <p>
            Every great research project starts with a question.
            Continue learning and turn your curiosity into meaningful research.
          </p>
          <Link to="/course" className="dashboard-primary-link">
            Explore your course →
          </Link>
        </div>
        <div className="dashboard-hero-icon" aria-hidden="true">🎓</div>
      </div>

      <div className="dashboard-section-heading">
        <div>
          <h2>Your learning overview</h2>
          <p>Track your progress and keep moving forward.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <article className="dashboard-card">
          <span className="dashboard-card-icon">📚</span>
          <p>Completed modules</p>
          <h3>{loading ? '...' : `${completedCount} / 7`}</h3>
          <span>Keep up the good work!</span>
        </article>

        <article className="dashboard-card">
          <span className="dashboard-card-icon">📈</span>
          <p>Overall progress</p>
          <h3>{loading ? '...' : `${percent}%`}</h3>
          <span>Your learning journey so far</span>
        </article>

        <article className="dashboard-card">
          <span className="dashboard-card-icon">🎯</span>
          <p>Remaining modules</p>
          <h3>{loading ? '...' : 7 - completedCount}</h3>
          <span>One step at a time</span>
        </article>
      </div>

      <article className="dashboard-progress-card">
        <div className="dashboard-section-heading">
          <div>
            <h2>Learning progress</h2>
            <p>You are making progress towards completing the course.</p>
          </div>
          <strong>{loading ? '...' : `${percent}%`}</strong>
        </div>

        <div
          className="dashboard-progress-track"
          role="progressbar"
          aria-label="Course completion"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={percent}
        >
          <div
            className="dashboard-progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="dashboard-progress-caption">
          {loading
            ? 'Loading your progress...'
            : `${completedCount} out of 7 modules completed`}
        </p>
      </article>

      {error && <p className="dashboard-error" role="alert">{error}</p>}

      {!loading && (
        <article className="dashboard-next-card">
          <div className="dashboard-next-icon">🚀</div>
          <div className="dashboard-next-content">
            <span className="dashboard-eyebrow">YOUR NEXT STEP</span>
            <h2>
              {nextModule
                ? `Module ${nextModule.id}: ${nextModule.name}`
                : 'You completed all seven modules!'}
            </h2>
            <p>
              {nextModule
                ? 'Continue your learning journey with the next module.'
                : 'Congratulations on completing your ResearchPath learning journey!'}
            </p>
            {nextModule && (
              <Link
                to={nextModule.path}
                className="dashboard-primary-link"
              >
                Continue learning →
              </Link>
            )}
          </div>
        </article>
      )}

      <div className="dashboard-section-heading">
        <div>
          <h2>Explore ResearchPath</h2>
          <p>Quickly access the tools you need for your research.</p>
        </div>
      </div>

      <div className="dashboard-quick-grid">
        <Link to="/course" className="dashboard-quick-card">
          <span>📖</span>
          <h3>My Course</h3>
          <p>Explore all seven research learning modules.</p>
          <strong>Open course →</strong>
        </Link>

        <Link to="/workspace" className="dashboard-quick-card">
          <span>✍️</span>
          <h3>Research Workspace</h3>
          <p>Develop questions, save notes and track sources.</p>
          <strong>Open workspace →</strong>
        </Link>

        <Link to="/quiz" className="dashboard-quick-card">
          <span>🧠</span>
          <h3>Practice Quiz</h3>
          <p>Test your understanding of research concepts.</p>
          <strong>Take a quiz →</strong>
        </Link>

        <Link to="/coach" className="dashboard-quick-card">
          <span>🤖</span>
          <h3>Research Coach</h3>
          <p>Get guidance while developing your research ideas.</p>
          <strong>Meet your coach →</strong>
        </Link>
      </div>
    </section>
  )
}

export default Dashboard
