import styles from './TopBar.module.css'

interface Props {
  isPlaying: boolean
  onToggle: () => void
}

export default function TopBar({ isPlaying, onToggle }: Props) {
  return (
    <div className={styles.bar}>
      <button
        className={styles.btn}
        onClick={onToggle}
        aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
      >
        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
            <rect x="3" y="2" width="4" height="14" rx="1.5" />
            <rect x="11" y="2" width="4" height="14" rx="1.5" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
            <path d="M4 2.5L15.5 9 4 15.5V2.5z" />
          </svg>
        )}
      </button>
    </div>
  )
}
