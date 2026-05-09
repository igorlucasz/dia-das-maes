import { useState, useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import DateInput from './DateInput'
import { generateStars } from './starfield'
import styles from './DateGate.module.css'
import musicaEntradaSrc from '../../assets/audio/música-entrada.mp3'

// hash da data — não decifrável a olho nu
const CORRECT_HASH =
  '3a794b9c0ab82aee74fc126cab085f86cc3a2783b535201088d5a166685fe188'
const EASTER_HASH =
  'eb23c6d7913a9103a7d97860daa24f87146cf68717a33ffad1d84eb0a9f232da'

type Status = 'idle' | 'checking' | 'error' | 'success' | 'exiting'

interface Props {
  onSuccess: (destination: 'main' | 'easter') => void
}

// Web Crypto API é nativa do navegador — sem dependências externas e roda
// apenas no client-side, o que é suficiente para um site estático.
async function hashDate(date: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(date),
  )
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function DateGate({ onSuccess }: Props) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const audioRef = useRef<HTMLAudioElement>(null)
  const destinationRef = useRef<'main' | 'easter'>('main')

  // Geradas uma vez — Math.random() dentro de useMemo não viola nenhuma regra
  // pois não precisa ser determinístico entre renders.
  const stars = useMemo(() => generateStars(65), [])

  // 'error' não bloqueia o input: a usuária precisa digitar para limpar a mensagem
  const isDisabled = status === 'checking' || status === 'success' || status === 'exiting'
  const isExiting = status === 'exiting'

  async function handleSubmit(submittedValue: string) {
    if (submittedValue.length !== 10 || status !== 'idle') return
    setStatus('checking')

    const hash = await hashDate(submittedValue)

    if (hash === CORRECT_HASH) {
      localStorage.setItem('validated', 'true')
      destinationRef.current = 'main'
      setStatus('success')
      // 2s de mensagem → inicia transição cinematográfica
      setTimeout(() => setStatus('exiting'), 2000)
    } else if (hash === EASTER_HASH) {
      destinationRef.current = 'easter'
      setStatus('exiting')
    } else {
      setStatus('error')
    }
  }

  // Qualquer mudança no input enquanto há erro descarta a mensagem imediatamente
  function handleChange(newValue: string) {
    if (status === 'error') setStatus('idle')
    setValue(newValue)
  }

  // Auto-submit quando os 8 dígitos estão preenchidos (UX mobile)
  useEffect(() => {
    if (value.length === 10 && status === 'idle') {
      handleSubmit(value)
    }
    // handleSubmit captura status do render atual — eslint-disable intencional
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Autoplay da música de entrada. Se bloqueado pela política do browser,
  // aguarda o primeiro clique ou tecla do usuário (once: true).
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.6
    const unlock = () => { audio.play().catch(() => {}) }
    audio.play().catch(() => {
      document.addEventListener('click', unlock, { once: true })
      document.addEventListener('keydown', unlock, { once: true })
    })
    return () => {
      document.removeEventListener('click', unlock)
      document.removeEventListener('keydown', unlock)
    }
  }, [])

  // Para a música no mesmo instante que a transição cinematográfica começa.
  useEffect(() => {
    if (!isExiting) return
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }, [isExiting])

  return (
    <motion.div
      className={styles.wrapper}
      initial="visible"
      animate={isExiting ? 'exiting' : 'visible'}
      variants={{
        visible: { opacity: 1 },
        exiting: { opacity: 0, transition: { duration: 0.8, delay: 0.4 } },
      }}
      onAnimationComplete={def => {
        if (def === 'exiting') onSuccess(destinationRef.current)
      }}
    >
      <audio ref={audioRef} src={musicaEntradaSrc} loop preload="auto" />

      {/* Starfield — escala para criar efeito de "voando para o espaço" */}
      <motion.div
        className={styles.starfield}
        animate={isExiting ? 'exiting' : 'visible'}
        variants={{
          visible: { scale: 1 },
          exiting: { scale: 2.5, transition: { duration: 1.2, ease: 'easeIn' } },
        }}
      >
        {stars.map(star => (
          <span
            key={star.id}
            className={`${styles.star} ${star.twinkle ? styles.twinkle : ''}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </motion.div>

      <div className={styles.rocket} aria-hidden="true">🚀</div>

      {/* Conteúdo central — entra com fade + slide */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
      >
        <h1 className={styles.title}>Quem está aí?</h1>
        <p className={styles.subtitle}>
          Digite sua data de nascimento para entrar
        </p>

        {/* Wrapper do input recebe o shake */}
        <motion.div
          className={styles.inputGroup}
          animate={status === 'error' ? 'shake' : 'idle'}
          variants={{
            idle: { x: 0 },
            shake: {
              x: [0, -8, 8, -6, 6, -3, 3, 0],
              transition: { duration: 0.4 },
            },
          }}
        >
          <DateInput
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            onSubmit={() => handleSubmit(value)}
          />
        </motion.div>

        {(status === 'success' || status === 'exiting') && destinationRef.current === 'main' && (
          <motion.p
            className={styles.messageSuccess}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            É você mesmo, mãe! Preparei algo especial pra você ver.
          </motion.p>
        )}

        {status === 'error' && (
          <motion.p
            className={styles.messageError}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Hmm, essa não é a astronauta que estou esperando... Tenta de novo?
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}
