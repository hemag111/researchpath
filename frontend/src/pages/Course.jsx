
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProgress } from '../backendApi'

const USER_ID = 'demo-asha'

const MODULES = [
  {
    id: 1,
    name: 'Find a topic',
    description: 'Understand research, its objectives, motivation and types.',
    path: '/module-1',
  },
  {
    id: 2,
    name: 'Ask a question',
    description: 'Learn how to identify curiosity and define a research problem.',
    path: '/lesson',
  },
  {
  id: 3,
  name: 'Literature review',
  description: 'Understand literature surveys and previous research.',
  path: '/module-3',
},
 {
  id: 4,
  name: 'Choose a method',
  description: 'Explore research design, population and sampling methods.',
  path: '/module-4',
},
{
  id: 5,
  name: 'Collect and analyze data',
  description: 'Learn about data collection, execution and analysis.',
  path: '/module-5',
},
{
  id: 6,
  name: 'Write and cite',
  description: 'Learn research report structure, writing and bibliography.',
  path: '/module-6',
},
{
  id: 7,
  name: 'Present',
  description: 'Understand research findings, conclusions and recommendations.',
  path: '/module-7',
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
    <section>
      <h1>ResearchPath Course</h1>
      <p>Follow the modules and complete your research learning journey.</p>

      <div className="course-progress">
        <h2>Your learning progress</h2>

        {loading ? (
          <p>Loading progress...</p>
        ) : (
          <>
            <p>
              {completedModules.length} of 7 modules completed
            </p>

            <div
              style={{
                width: '100%',
                height: '12px',
                background: '#ddd',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: '100%',
                  background: '#087f68',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            <p>{percent}% completed</p>
          </>
        )}
      </div>

      {error && <p role="alert">{error}</p>}

      <div className="course-grid">
        {MODULES.map((module) => {
          const completed = completedModules.includes(module.id)
          const available = Boolean(module.path)

          return (
            <div className="module-card" key={module.id}>
              <h2>
                Module {module.id}: {module.name}
              </h2>

              <p>{module.description}</p>

              <p>
                Status:{' '}
                {completed
                  ? 'Completed'
                  : available
                    ? 'Available'
                    : 'Coming soon'}
              </p>

              {available && (
                <Link to={module.path}>
                  {completed ? 'Review module' : 'Start learning'}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Course
