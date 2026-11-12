import { useState, useEffect, useRef } from 'react'
import { NavLink, Routes, Route, useLocation } from 'react-router-dom'
import ProfileSwitcher from './components/ProfileSwitcher'
import { OPTIONS } from './settings'
import Dashboard from './pages/Dashboard'
import Course from './pages/Course'
import Lesson from './pages/Lesson'
import Workspace from './pages/Workspace'
import Quiz from './pages/Quiz'
import Mentor from './pages/Mentor'
import ResearchCoach from './ResearchCoach'
import Module1 from './pages/Module1'
import Module3 from './pages/Module3'
import Module4 from './pages/Module4'
import Module5 from './pages/Module5'
import Module6 from './pages/Module6'
import Module7 from './pages/Module7'

const STORAGE_KEY = 'researchpath-settings'
const DEFAULTS = { contrast: false, size: false, font: false, focus: false }

const TITLES = {
  '/': 'Dashboard',
  '/course': 'Course',
  '/lesson': 'Lesson',
  '/workspace': 'Workspace',
  '/quiz': 'Quiz',
  '/mentor': 'Mentor',
  '/coach': 'Research Coach',
  '/module-1': 'Module 1',
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

function App() {
  const [active, setActive] = useState(loadSettings)
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    OPTIONS.forEach((o) => {
      document.documentElement.setAttribute(
        o.attr,
        active[o.key] ? o.on : o.off
      )
    })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(active))
    } catch {
      // Storage can be blocked, so the settings just won't be saved.
    }
  }, [active])

  useEffect(() => {
    document.title = `${TITLES[pathname] ?? 'Page'} | ResearchPath`

    if (previousPath.current !== pathname) {
      previousPath.current = pathname
      document.querySelector('main h1')?.focus()
    }
  }, [pathname])

  function toggle(key) {
    setActive({ ...active, [key]: !active[key] })
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header>
        <p>ResearchPath</p>
        <ProfileSwitcher active={active} onToggle={toggle} />
        <nav aria-label="Main">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/course">Course</NavLink>
          <NavLink to="/lesson">Lesson</NavLink>
          <NavLink to="/workspace">Workspace</NavLink>
          <NavLink to="/quiz">Quiz</NavLink>
          <NavLink to="/mentor">Mentor</NavLink>
          <NavLink to="/coach">Coach</NavLink>
        </nav>
      </header>
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course" element={<Course />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/coach" element={<ResearchCoach />} />
          <Route path="/module-1" element={<Module1 />} />
          <Route path="/module-3" element={<Module3 />} />
          <Route path="/module-4" element={<Module4 />} />
          <Route path="/module-5" element={<Module5 />} />
          <Route path="/module-6" element={<Module6 />} />
          <Route path="/module-7" element={<Module7 />} />
        </Routes>
      </main>
    </>
  )
}

export default App