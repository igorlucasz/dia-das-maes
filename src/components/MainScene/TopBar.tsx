import { useTimeCounter } from '../../hooks/useTimeCounter'
import { PlayIcon, PauseIcon } from '../icons/AudioIcons'
import VolumeControl from './VolumeControl'
import styles from './TopBar.module.css'

// 08/05/2007 16:00:00 horário de Brasília (UTC-3)
const START_DATE = new Date('2007-05-08T16:00:00-03:00')

interface Props {
  isPlaying: boolean
  onToggle: () => void
  audioRef: React.RefObject<HTMLAudioElement>
}

export default function TopBar({ isPlaying, onToggle, audioRef }: Props) {
  const { days, hours, minutes, seconds } = useTimeCounter(START_DATE)

  return (
    <div className={styles.bar}>
      <p className={styles.counter}>
        <span>nos conhecemos há </span>
        {/* mobile: abreviado pra caber na 2ª linha */}
        <span className={styles.short}>
          {days} dias, {hours} horas, {minutes} min e {seconds} seg
        </span>
        {/* desktop: formato completo numa linha */}
        <span className={styles.long}>
          {days} dias, {hours} horas, {minutes} minutos e {seconds} segundos
        </span>
      </p>
      <div className={styles.controls}>
        <VolumeControl audioRef={audioRef} />
        <button
          className={styles.btn}
          onClick={onToggle}
          aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </div>
  )
}
