import { useState } from 'react'
import { PlayIcon, PauseIcon, VolumeIcon, MutedIcon } from '../icons/AudioIcons'
import styles from './AngelicAudioControls.module.css'

interface Props {
  skydance: HTMLAudioElement | null
  initialVolume: number
  onVolumeChange?: (v: number) => void
}

export default function AngelicAudioControls({ skydance, initialVolume, onVolumeChange }: Props) {
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(initialVolume)

  function togglePlay() {
    if (!skydance) return
    if (skydance.paused) {
      skydance.play().catch(() => {})
      setPaused(false)
    } else {
      skydance.pause()
      setPaused(true)
    }
  }

  function toggleMute() {
    if (!skydance) return
    skydance.muted = !skydance.muted
    setMuted(skydance.muted)
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value)
    if (skydance) skydance.volume = val
    setVolume(val)
    onVolumeChange?.(val)
  }

  return (
    <div className={styles.controls}>
      <input
        type="range"
        className={styles.slider}
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={handleVolume}
        aria-label="Volume da música"
      />
      <button className={styles.btn} onClick={toggleMute} aria-label={muted ? 'Ativar som' : 'Silenciar'}>
        {muted ? <MutedIcon /> : <VolumeIcon />}
      </button>
      <button className={styles.btn} onClick={togglePlay} aria-label={paused ? 'Tocar' : 'Pausar'}>
        {paused ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  )
}
