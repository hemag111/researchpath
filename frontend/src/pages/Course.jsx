
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProgress } from '../backendApi'

const USER_ID = 'demo-asha'

const MODULES = [
  {
    id: 1,
    name: 'Find a Topic',
    description: 'Understand research, its objectives, motivation and types.',
    path: '/module-1',
    icon: '💡',
  },
  {
    id: 2,
    name: 'Ask a Question',
    description: 'Learn how to identify curiosity and define a research problem.',
    path: '/lesson',
    icon: '❓',
  },
  {
    id: 3,
    name: 'Literature Review',
    description: 'Understand literature surveys and previous research.',
    path: '/module-3',
    icon: '📚',
  },
  {
    id: 4,
    name: 'Choose a Method',
    description: 'Explore research design, population and sampling methods.',
    path: '/module-4',
    icon: '🔬',
  },
  {
    id: 5,
    name: 'Collect and Analyze Data',
    description: 'Learn about data collection, execution and analysis.',
    path: '/module-5',
    icon: '📊',
  },
  {
    id: 6,
    name: 'Write and Cite',
    description: 'Learn research report structure, writing and bibliography.',
    path: '/module-6',
    icon: '📝',
  },
  {
    id: 7,
    name: 'Present',
    description: 'Understand research findings, conclusions and recommendations.',
    path: '/module-7',
    icon: '🎯',
  },
]

function Course() {
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
        setError('Unable to load progress. Please check the backend.')
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  return (
    <section className="course-page">
      <div className="course-hero">
        <span className="course-eyebrow">YOUR LEARNING PATH</span>
        <h1 tabIndex="-1">Explore Your Course 📚</h1>
        <p>
          Build your research skills step by step. Complete each module
          and develop the knowledge needed to carry out meaningful research.
        </p>
      </div>

      <div className="course-overview">
        <div>
          <span className="course-overview-icon">🎓</span>
          <div>
            <h2>Your Course Progress</h2>
            <p>Keep learning and move closer to your goal.</p>
          </div>
        </div>

        <div className="course-overview-numbers">
          <strong>{loading ? '...' : `${completedModules.length}/7`}</strong>
          <span>Modules completed</span>
        </div>

        <div
          className="course-progress-track"
          role="progressbar"
          aria-label="Course completion"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={percent}
        >
          <div
            className="course-progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="course-progress-caption">
          {loading ? 'Loading progress...' : `${percent}% of your course completed`}
        </p>
      </div>

      {error && <p className="course-error" role="alert">{error}</p>}

      <div className="course-heading">
        <div>
          <h2>All Learning Modules</h2>
          <p>Choose a module and continue your research journey.</p>
        </div>
        <span className="course-module-count">7 Modules</span>
      </div>

      <div className="course-grid">
        {MODULES.map((module) => {
          const completed = completedModules.includes(module.id)

          return (
            <article
              className={`course-module-card ${completed ? 'is-completed' : ''}`}
              key={module.id}
            >
              <div className="course-module-top">
                <span className="course-module-icon">{module.icon}</span>
                <span className={`course-status ${completed ? 'completed' : 'available'}`}>
                  {completed ? '✓ Completed' : 'Available'}
                </span>
              </div>

              <span className="course-module-number">
                MODULE {String(module.id).padStart(2, '0')}
              </span>

              <h3>{module.name}</h3>
              <p>{module.description}</p>

              <div className="course-module-footer">
                <span>
                  {completed ? 'Ready for revision' : 'Continue your learning'}
                </span>

                <Link to={module.path}>
                  {completed ? 'Review module →' : 'Start learning →'}
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {!loading && completedModules.length === 7 && (
        <div className="course-completion-message">
          <span>🏆</span>
          <div>
            <h2>Congratulations!</h2>
            <p>You have successfully completed all seven modules.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Course
