import { useMemo } from 'react'
import styles from './CosmicDust.module.css'

// 6 variantes de drift pré-definidas → evita var() em @keyframes (compat Safari)
const DRIFT_CLASSES = [
  styles.driftA,
  styles.driftB,
  styles.driftC,
  styles.driftD,
  styles.driftE,
  styles.driftF,
]

interface Dust {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  driftIdx: number
}

function generateDust(count: number): Dust[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,  // % da altura do container (escala com --page-height)
    delay: Math.random() * 20,
    duration: 18 + Math.random() * 22,
    driftIdx: Math.floor(Math.random() * DRIFT_CLASSES.length),
  }))
}

// Oculto em mobile — 25 pontos 1px flutuando. Adiciona profundidade sutil.
export default function CosmicDust() {
  const particles = useMemo(() => generateDust(25), [])

  return (
    <div className={styles.container} aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className={`${styles.dust} ${DRIFT_CLASSES[p.driftIdx]}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
