import { useState, useEffect, useRef } from 'react'
import { VolumeIcon, MutedIcon } from '../icons/AudioIcons'
import styles from './VolumeControl.module.css'

const INITIAL_VOLUME = 0.7

interface Props {
  audioRef: React.RefObject<HTMLAudioElement>
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export default function VolumeControl({ audioRef }: Props) {
  const [volume, setVolume] = useState(INITIAL_VOLUME)
  const [muted, setMuted] = useState(false)
  const savedVol = useRef(INITIAL_VOLUME)
  const isMobile = useIsMobile()

  function applyVolume(v: number) {
    const a = audioRef.current
    if (a) a.volume = v
  }

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    if (v > 0) savedVol.current = v
    setVolume(v)
    setMuted(v === 0)
    applyVolume(v)
  }

  function toggleMute() {
    if (muted) {
      const v = savedVol.current
      setVolume(v)
      setMuted(false)
      applyVolume(v)
    } else {
      savedVol.current = volume
      setMuted(true)
      setVolume(0)
      applyVolume(0)
    }
  }

  return (
    <div className={styles.wrap}>
      <button
        className={styles.iconBtn}
        onClick={toggleMute}
        aria-label={muted ? 'Ativar som' : 'Silenciar'}
      >
        {muted ? <MutedIcon /> : <VolumeIcon />}
      </button>
      {!isMobile && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={volume}
          onChange={handleSlider}
          className={styles.slider}
          aria-label="Volume"
        />
      )}
    </div>
  )
}

