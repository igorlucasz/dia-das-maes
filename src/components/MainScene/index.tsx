import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer'
import TopBar from './TopBar'
import StarField from './StarField'
import Planets from './Planets'
import audioSrc from '../../assets/audio/astronauta-de-marmore.mp3'
import styles from './MainScene.module.css'

export default function MainScene() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Connects Web Audio API to the <audio> element and writes CSS vars to :root.
  // Must come before the play effect so AudioContext is ready first.
  useAudioAnalyzer(audioRef)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false)) // autoplay blocked: user clicks play
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Hidden audio element — controlled via ref */}
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />

      <TopBar isPlaying={isPlaying} onToggle={togglePlay} />

      {/* Background layer: stars + planets */}
      <div className={styles.background} aria-hidden="true">
        <StarField />
        <Planets />
      </div>

      {/* Placeholder text — mantido conforme brief */}
      <div className={styles.content}>
        <p className={styles.label}>Bem-vinda 🌟</p>
        <p className={styles.sub}>A cena principal vem na próxima etapa…</p>
      </div>
    </motion.div>
  )
}
