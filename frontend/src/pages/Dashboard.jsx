
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProgress } from '../backendApi'

const USER_ID = 'demo-asha'

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
        setError('Unable to load your learning progress.')
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  const completedCount = completedModules.length

  const nextModule = Array.from(
    { length: 7 },
    (_, index) => index + 1
  ).find(module => !completedModules.includes(module))

  const moduleNames = {
    1: 'Find a Topic',
    2: 'Ask a Question',
    3: 'Literature Review',
    4: 'Choose a Method',
    5: 'Collect and Analyze Data',
    6: 'Write and Cite',
    7: 'Present',
  }

  return (
    <section>
      <h1 tabIndex="-1">Welcome back, Asha!</h1>
      <p>Continue your research learning journey with ResearchPath.</p>

      <div className="dashboard-progress">
        <h2>Your learning progress</h2>

        {loading ? (
          <p>Loading your progress...</p>
        ) : (
          <>
            <h3>{percent}% Completed</h3>

            <div
              style={{
                width: '100%',
                height: '14px',
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
                  borderRadius: '10px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            <p>{completedCount} of 7 modules completed</p>
          </>
        )}
      </div>

      {error && <p role="alert">{error}</p>}

      {!loading && (
        <div>
          <h2>Next recommended module</h2>

          {nextModule ? (
            <>
              <p>
                Module {nextModule}: {moduleNames[nextModule]}
              </p>

              <Link to={`/module-${nextModule}`}>
                Continue learning
              </Link>
            </>
          ) : (
            <p>
              Congratulations! You have completed all seven modules.
            </p>
          )}
        </div>
      )}

      <div>
        <h2>Quick access</h2>
        <Link to="/course">View all modules</Link>
      </div>
    </section>
  )
}

export default Dashboard
