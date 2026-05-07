import { useEffect, useRef, useState } from 'react'
import styles from './TimelineCard.module.css'

interface Props {
  date: string
  position: 'left' | 'right'
}

export default function TimelineCard({ date, position }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={[
        styles.card,
        styles[position],
        visible ? styles.visible : '',
      ].filter(Boolean).join(' ')}
    >
      <p className={styles.date}>{date}</p>
      <div className={styles.imagePlaceholder} aria-hidden="true">
        <span className={styles.photoIcon}>🖼️</span>
        <span className={styles.photoLabel}>foto em breve</span>
      </div>
      <p className={styles.text}>
        Texto placeholder que será substituído com a memória real deste momento especial.
      </p>
    </div>
  )
}
