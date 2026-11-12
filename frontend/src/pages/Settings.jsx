
import ProfileSwitcher from '../components/ProfileSwitcher'

function Settings({ active, onToggle }) {
  return (
    <main className="settings-page">
      <section className="settings-hero">
        <div>
          <span className="settings-eyebrow">PERSONALIZE YOUR EXPERIENCE</span>
          <h1>Settings & Preferences</h1>
          <p>
            Make ResearchPath more comfortable and accessible.
            Customize the appearance and reading experience according
            to your preferences.
          </p>
        </div>
        <div className="settings-hero-icon">⚙️</div>
      </section>

      <section className="settings-card">
        <div className="settings-heading">
          <span className="settings-icon">♿</span>
          <div>
            <h2>Accessibility Settings</h2>
            <p>Choose the options that make learning easier for you.</p>
          </div>
        </div>

        <div className="settings-options">
          <ProfileSwitcher active={active} onToggle={onToggle} />
        </div>

        <div className="settings-tip">
          <span>💡</span>
          <p>
            Your selected preferences are applied across ResearchPath.
            You can change them whenever you want.
          </p>
        </div>
      </section>

      <section className="settings-info-grid">
        <article className="settings-info-card">
          <span>🎨</span>
          <h3>Display preferences</h3>
          <p>Choose a display style that is comfortable for your eyes.</p>
        </article>

        <article className="settings-info-card">
          <span>📖</span>
          <h3>Reading comfort</h3>
          <p>Adjust text size and font preferences for easier reading.</p>
        </article>

        <article className="settings-info-card">
          <span>🎯</span>
          <h3>Focus experience</h3>
          <p>Reduce distractions and concentrate on your learning.</p>
        </article>
      </section>
    </main>
  )
}

export default Settings
