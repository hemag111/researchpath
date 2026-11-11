import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <>
      <h1 tabIndex="-1">Welcome back, Asha</h1>
      <p>Step 2 of 7 is done. Next up: Read what already exists.</p>
      <Link to="/course">Go to the course</Link>
    </>
  )
}

export default Dashboard