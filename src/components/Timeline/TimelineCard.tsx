import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './TimelineCard.module.css'

const PREVIEW_MAX_CHARS = 120

interface Props {
  title: string
  text: string
  photos: string[]
  position: 'left' | 'right'
  globalPhotoIndex: number
  onClick: () => void
}

export default function TimelineCard({ title, text, photos, position, globalPhotoIndex, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const currentPhotoIndex = photos.length > 0 ? globalPhotoIndex % photos.length : 0
  const previewText = text.length > PREVIEW_MAX_CHARS
    ? text.slice(0, PREVIEW_MAX_CHARS).trimEnd() + '...'
    : text

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
      role="button"
      tabIndex={0}
      aria-label={`Abrir memória de ${title}`}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      className={[
        styles.card,
        styles[position],
        visible ? styles.visible : '',
      ].filter(Boolean).join(' ')}
    >
      <p className={styles.date}>{title}</p>
      <div className={styles.photoWrapper}>
        {photos.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhotoIndex}
              src={photos[currentPhotoIndex]}
              alt=""
              className={styles.photo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              loading="eager"
            />
          </AnimatePresence>
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            <span className={styles.photoIcon}>🖼️</span>
            <span className={styles.photoLabel}>foto em breve</span>
          </div>
        )}
      </div>
      <p className={styles.text}>{previewText}</p>
    </div>
  )
}
