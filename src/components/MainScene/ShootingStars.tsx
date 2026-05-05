import { useState, useEffect, useRef } from 'react'
import styles from './ShootingStars.module.css'

interface Star {
  id: number
  startX: number  // vw (pode ser negativo = começa fora da tela)
  startY: number  // vh
  angle: number   // graus
}

// Máximo 1 cadente visível por vez. Intervalo aleatório 5-18s entre aparições.
export default function ShootingStars() {
  const [star, setStar] = useState<Star | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  function scheduleNext() {
    const delay = 5000 + Math.random() * 13000
    timerRef.current = setTimeout(() => {
      setStar({
        id: Date.now(),
        startX: Math.random() * 55 - 15,  // -15 a 40 vw
        startY: Math.random() * 50,        // 0 a 50 vh
        angle: 18 + Math.random() * 38,   // 18-56 graus
      })
    }, delay)
  }

  useEffect(() => {
    scheduleNext()
    return () => clearTimeout(timerRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleDone() {
    setStar(null)
    scheduleNext()
  }

  if (!star) return null

  return (
    // Container rotacionado define a direção de viagem
    <div
      className={styles.container}
      style={{
        top: `${star.startY}vh`,
        left: `${star.startX}vw`,
        transform: `rotate(${star.angle}deg)`,
      }}
    >
      {/* key garante re-mount (e reinício da animação) a cada nova cadente */}
      <div key={star.id} className={styles.trail} onAnimationEnd={handleDone} />
    </div>
  )
}
