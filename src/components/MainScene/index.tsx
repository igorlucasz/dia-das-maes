import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAudioAnalyzer } from '../../hooks/useAudioAnalyzer'
import { fadeAudio } from '../../hooks/useAudioFade'
import { useBottleUnlock } from '../../hooks/useBottleUnlock'
import TopBar from './TopBar'
import Nebulae from './Nebulae'
import Constellations from './Constellations'
import CosmicDust from './CosmicDust'
import StarField from './StarField'
import Planets from './Planets'
import ShootingStars from './ShootingStars'
import Timeline from '../Timeline'
import Bottle from '../Bottle'
import audioSrc from '../../assets/audio/astronauta-de-marmore.mp3'
import musicaEmocionante from '../../assets/audio/som-emocionante.mp3'
import skydanceSrc from '../../assets/audio/skydance.mp3'
import styles from './MainScene.module.css'

interface Props {
  onGoAngelic?: () => void
  hidden?: boolean
}

export default function MainScene({ onGoAngelic, hidden }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const emocionanteRef = useRef<HTMLAudioElement>(null)
  const skydanceRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const wasPlayingBeforeBottleRef = useRef(false)
  const fadeIntervalsRef = useRef<{
    astronauta?: ReturnType<typeof setInterval>
    emocionante?: ReturnType<typeof setInterval>
    emocionanteDelay?: ReturnType<typeof setTimeout>
    skydance?: ReturnType<typeof setInterval>
  }>({})

  const { unlocked, unlock } = useBottleUnlock()
  const [scrolledHalf, setScrolledHalf] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const volumeBeforeBottleRef = useRef(0.7)
  const preAngelicVolumeRef = useRef(0.7)
  const skydancePositionRef = useRef(0)
  const wasPlayingBeforeAngelicRef = useRef(false)
  const prevHiddenRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight = document.documentElement.scrollHeight
      const scrolled = window.scrollY + window.innerHeight
      if (scrolled >= pageHeight * 0.5) {
        setScrolledHalf(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detecta retorno da AngelicScene (hidden true → false) e retoma a música
  useEffect(() => {
    if (prevHiddenRef.current && !hidden) {
      // Fade out skydance, salva posição e pausa após 2s
      const skydance = skydanceRef.current
      if (skydance && !skydance.paused) {
        skydancePositionRef.current = skydance.currentTime
        clearInterval(fadeIntervalsRef.current.skydance)
        fadeIntervalsRef.current.skydance = fadeAudio(skydance, 0, 2000, () => {
          skydance.pause()
          delete fadeIntervalsRef.current.skydance
        })
      }

      // Retoma astronauta
      const audio = audioRef.current
      if (audio && wasPlayingBeforeAngelicRef.current) {
        audio.volume = 0.01
        audioCtxRef.current?.resume().catch(() => {})
        audio.play()
          .then(() => {
            setIsPlaying(true)
            fadeAudio(audio, preAngelicVolumeRef.current, 2500)
          })
          .catch(() => {})
      }
      setIsTransitioning(false)
    }
    prevHiddenRef.current = !!hidden
  // audioCtxRef is a stable ref — eslint-disable intencional
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden])

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

  function handleBottleOpen() {
    const astronauta = audioRef.current
    const emocionante = emocionanteRef.current
    if (!astronauta || !emocionante) return

    wasPlayingBeforeBottleRef.current = isPlaying
    volumeBeforeBottleRef.current = astronauta.volume

    clearInterval(fadeIntervalsRef.current.astronauta)
    clearInterval(fadeIntervalsRef.current.emocionante)
    fadeIntervalsRef.current = {}

    if (isPlaying) {
      fadeIntervalsRef.current.astronauta = fadeAudio(astronauta, 0.01, 4000, () => {
        astronauta.pause()
        delete fadeIntervalsRef.current.astronauta
      })
    }

    // emocionante entra após 3s — curva exponencial já tornou o astronauta quase inaudível
    fadeIntervalsRef.current.emocionanteDelay = setTimeout(() => {
      delete fadeIntervalsRef.current.emocionanteDelay
      emocionante.currentTime = 0
      emocionante.volume = 0
      emocionante.play().catch(() => {})
      fadeIntervalsRef.current.emocionante = fadeAudio(emocionante, 0.8, 2500, () => {
        delete fadeIntervalsRef.current.emocionante
      })
    }, 1000)
  }

  function handleBottleClose() {
    unlock()

    const astronauta = audioRef.current
    const emocionante = emocionanteRef.current
    if (!astronauta || !emocionante) return

    clearInterval(fadeIntervalsRef.current.astronauta)
    clearInterval(fadeIntervalsRef.current.emocionante)
    clearTimeout(fadeIntervalsRef.current.emocionanteDelay)
    fadeIntervalsRef.current = {}

    fadeIntervalsRef.current.emocionante = fadeAudio(emocionante, 0, 1500, () => {
      emocionante.pause()
      delete fadeIntervalsRef.current.emocionante
    })

    if (wasPlayingBeforeBottleRef.current) {
      if (astronauta.paused) {
        astronauta.volume = 0.05
        audioCtxRef.current?.resume().catch(() => {})
        astronauta.play().catch(() => {})
      }
      fadeIntervalsRef.current.astronauta = fadeAudio(astronauta, volumeBeforeBottleRef.current, 3000, () => {
        delete fadeIntervalsRef.current.astronauta
      })
    }
  }

  function handleGoAngelic() {
    if (isTransitioning) return
    setIsTransitioning(true)

    clearInterval(fadeIntervalsRef.current.astronauta)
    clearInterval(fadeIntervalsRef.current.emocionante)
    clearTimeout(fadeIntervalsRef.current.emocionanteDelay)
    fadeIntervalsRef.current = {}

    const astronauta = audioRef.current
    const emocionante = emocionanteRef.current
    const audioPlaying = (astronauta && !astronauta.paused) || (emocionante && !emocionante.paused)

    // Capturar estado antes do fade para restaurar ao voltar
    wasPlayingBeforeAngelicRef.current = isPlaying
    preAngelicVolumeRef.current = astronauta && !astronauta.paused ? astronauta.volume : 0.7

    if (astronauta && !astronauta.paused) {
      fadeAudio(astronauta, 0.01, 2500, () => { astronauta.pause() })
    }
    if (emocionante && !emocionante.paused) {
      fadeAudio(emocionante, 0.01, 1000, () => { emocionante.pause() })
    }

    // Skydance: começa imediatamente com fade in ao entrar na cena angelical
    const skydance = skydanceRef.current
    if (skydance) {
      clearInterval(fadeIntervalsRef.current.skydance)
      skydance.volume = 0
      skydance.currentTime = skydancePositionRef.current
      skydance.play().catch(() => {})
      fadeIntervalsRef.current.skydance = fadeAudio(skydance, 0.75, 2500, () => {
        delete fadeIntervalsRef.current.skydance
      })
    }

    // Overlay takes 800ms to cover — start at 1700ms so music fades to silence
    // before MainScene unmounts (1700 + 800 = 2500ms = fade duration)
    setTimeout(() => onGoAngelic?.(), audioPlaying ? 1700 : 0)
  }

  return (
    <>
      {/* ShootingStars position:fixed — ocultar quando hidden para não vazar sobre AngelicScene */}
      {!hidden && <ShootingStars />}

      <motion.div
        className={styles.wrapper}
        style={{ display: hidden ? 'none' : undefined }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <audio ref={audioRef} src={audioSrc} loop preload="auto" />
        <audio ref={emocionanteRef} src={musicaEmocionante} preload="auto" />
        <audio ref={skydanceRef} src={skydanceSrc} loop preload="auto" />

        {/* TopBar position:absolute — fica no topo da página e some ao rolar */}
        <TopBar isPlaying={isPlaying} onToggle={togglePlay} audioRef={audioRef} />

        {/* Ícone angelical — visível após abrir a garrafa E rolar 50% da página */}
        {unlocked && scrolledHalf && (
          <motion.button
            className={styles.angelicHint}
            onClick={handleGoAngelic}
            style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            aria-label="Descobrir algo especial"
          >
            <span className={styles.angelicHintIcon}>🕊️</span>
            <span className={styles.angelicHintText}>algo mudou...</span>
          </motion.button>
        )}

        {/* Camada de fundo: cobre toda a altura de --page-height (ver global.css) */}
        <div className={styles.background} aria-hidden="true">
          <Nebulae />         {/* atrás de tudo — z-index 0 */}
          <Constellations />  {/* z-index 1 */}
          <CosmicDust />      {/* z-index 2, só desktop */}
          <StarField />       {/* z-index 3 */}
          <Planets />         {/* z-index 4 */}
        </div>

        {/* Boas-vindas — primeira viewport */}
        <div className={styles.content}>
          <p className={styles.label}>Bem-Vinda, Mãe🌟</p>
          <p className={styles.sub}>Uma viagem pelo nosso tempo juntos ✨</p>
        </div>

        {/* Bloco unificado: placeholder + timeline — posição vertical controlada por --content-top */}
        <div className={styles.contentBlock}>
          <div className={styles.contentPlaceholder}>
            <span className={styles.placeholderIcon}>🚀</span>
            <span className={styles.placeholderText}>elemento principal em breve</span>
          </div>

          {/* Timeline vertical — começa após o placeholder */}
          <Timeline />

          {/* Garrafa animada — após o último quadro */}
          <Bottle onOpen={handleBottleOpen} onClose={handleBottleClose} />
        </div>
      </motion.div>
    </>
  )
}
