import { OPTIONS } from '../settings'

function ProfileSwitcher({ active, onToggle }) {
  return (
    <div role="group" aria-label="Accessibility settings">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={active[o.key]}
          onClick={() => onToggle(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default ProfileSwitcher