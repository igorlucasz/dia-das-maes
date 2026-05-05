import { useState, useEffect, useRef } from 'react'
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
        {muted ? <SpeakerOff /> : volume < 0.4 ? <SpeakerLow /> : <SpeakerHigh />}
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

function SpeakerHigh() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 6.5h3l4-3.5v11L5 10.5H2V6.5z" fill="currentColor" />
      <path d="M12.5 5.5a4.5 4.5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M14.8 3.2a7.5 7.5 0 0 1 0 11.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SpeakerLow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 6.5h3l4-3.5v11L5 10.5H2V6.5z" fill="currentColor" />
      <path d="M12.5 5.5a4.5 4.5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SpeakerOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 6.5h3l4-3.5v11L5 10.5H2V6.5z" fill="currentColor" />
      <line x1="13" y1="6" x2="17" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="17" y1="6" x2="13" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
