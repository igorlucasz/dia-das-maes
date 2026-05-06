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

  // Conecta Web Audio API e escreve CSS vars no :root (sem re-renders).
  // Retorna ctxRef para que possamos chamar ctx.resume() em gestos do usuário.
  const audioCtxRef = useAudioAnalyzer(audioRef)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    // Resume the AudioContext before play — on page load without a prior user
    // gesture the context starts suspended; this call may silently fail but
    // clicking Play (togglePlay) will retry it with a real user gesture.
    audioCtxRef.current?.resume().catch(() => {})
    audio.play()
      .then(() => {
        console.log('[AUDIO_DEBUG] audio.play() resolved — paused:', audio.paused, 'currentTime:', audio.currentTime)
        setIsPlaying(true)
      })
      .catch(e => {
        console.warn('[AUDIO_DEBUG] audio.play() blocked (autoplay policy):', e)
        setIsPlaying(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      // User gesture — resume the AudioContext first so the pipeline is running
      audioCtxRef.current?.resume()
        .then(() => console.log('[AUDIO_DEBUG] ctx.resume() after user gesture — state:', audioCtxRef.current?.state))
        .catch(() => {})
      audio.play()
        .then(() => {
          console.log('[AUDIO_DEBUG] audio.play() resolved — currentTime:', audio.currentTime)
          setIsPlaying(true)
        })
        .catch(() => {})
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
