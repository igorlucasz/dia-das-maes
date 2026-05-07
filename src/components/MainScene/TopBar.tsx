import { useTimeCounter } from '../../hooks/useTimeCounter'
import VolumeControl from './VolumeControl'
import styles from './TopBar.module.css'

// 08/05/2007 16:00:00 BRT (UTC-3) = 19:00:00 UTC
const START_DATE = new Date('2007-05-08T19:00:00Z')

interface Props {
  isPlaying: boolean
  onToggle: () => void
  audioRef: React.RefObject<HTMLAudioElement>
}

export default function TopBar({ isPlaying, onToggle, audioRef }: Props) {
  const { days, hours, seconds } = useTimeCounter(START_DATE)

  return (
    <div className={styles.bar}>
      <p className={styles.counter}>
        <span>nos conhecemos há </span>
        <span>{days} dias, {hours} horas e {seconds} segundos</span>
      </p>
      <div className={styles.controls}>
        <VolumeControl audioRef={audioRef} />
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
    </div>
  )
}
