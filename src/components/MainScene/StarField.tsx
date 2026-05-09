import { useMemo } from 'react'
import styles from './StarField.module.css'

interface Star {
  id: number
  x: number
  y: number
  size: number
  reactivity: number
  color: string
  delay: number
  duration: number
}

const STAR_COLORS = ['#ffffff', '#e8f0ff', '#fff8e8', '#f0e8ff', '#e8fff8']

const isInExclusionZone = (x: number, y: number) =>
  x > 20 && x < 80 && y > 25 && y < 55

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => {
    let x, y
    do {
      x = Math.random() * 100
      y = Math.random() * 100
    } while (isInExclusionZone(x, y))

    return {
      id: i,
      x,
      y,
      size: 1 + Math.random() * 2,
      reactivity: Math.random(),
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      delay: Math.random() * 6,
      duration: 2.5 + Math.random() * 4,
    }
  })
}

// CSS custom properties (--audio-mids, --audio-treble) on :root drive all
// reactive star styles at the CSS level — no React re-renders per frame.
export default function StarField() {
  const stars = useMemo(() => generateStars(100), [])

  return (
    <div className={styles.field}>
      {stars.map(star => {
        let cls = styles.star
        if (star.reactivity < 0.3) {
          cls += ` ${styles.decorative}`
        } else if (star.reactivity < 0.7) {
          cls += ` ${styles.midReactive}`
        } else {
          cls += ` ${styles.highReactive}`
        }

        return (
          <span
            key={star.id}
            className={cls}
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: star.color,
                '--reactivity': star.reactivity.toFixed(3),
                '--twinkle-delay': `${star.delay}s`,
                '--twinkle-duration': `${star.duration}s`,
              } as React.CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
