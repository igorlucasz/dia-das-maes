import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer'
import TopBar from './TopBar'
import Nebulae from './Nebulae'
import Constellations from './Constellations'
import CosmicDust from './CosmicDust'
import StarField from './StarField'
import Planets from './Planets'
import ShootingStars from './ShootingStars'
import audioSrc from '../../assets/audio/astronauta-de-marmore.mp3'
import styles from './MainScene.module.css'

export default function MainScene() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Conecta Web Audio API e escreve CSS vars no :root (sem re-renders)
  useAudioAnalyzer(audioRef)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
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
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />

      {/* TopBar fica fixo no topo durante o scroll */}
      <TopBar isPlaying={isPlaying} onToggle={togglePlay} audioRef={audioRef} />

      {/* Camada de fundo: cobre toda a altura de 300vh */}
      <div className={styles.background} aria-hidden="true">
        <Nebulae />         {/* atrás de tudo — z-index 0 */}
        <Constellations />  {/* z-index 1 */}
        <CosmicDust />      {/* z-index 2, só desktop */}
        <StarField />       {/* z-index 3 */}
        <Planets />         {/* z-index 4 */}
      </div>

      {/* Estrelas cadentes: position:fixed, independe do scroll */}
      <ShootingStars />

      {/* Texto placeholder — visível na primeira viewport */}
      <div className={styles.content}>
        <p className={styles.label}>Bem-vinda 🌟</p>
        <p className={styles.sub}>A cena principal vem na próxima etapa…</p>
      </div>
    </motion.div>
  )
}
