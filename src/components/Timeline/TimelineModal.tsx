import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { CardData } from './index'
import styles from './TimelineModal.module.css'

interface Props {
  card: CardData | null
  onClose: () => void
}

export default function TimelineModal({ card, onClose }: Props) {
  useEffect(() => {
    if (card) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [card])

  useEffect(() => {
    if (!card) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [card, onClose])

  return createPortal(
    <AnimatePresence>
      {card && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
            <p className={styles.date}>{card.date}</p>
            <div className={styles.imagePlaceholder} aria-hidden="true">
              <span className={styles.photoIcon}>🖼️</span>
              <span className={styles.photoLabel}>foto em breve</span>
            </div>
            <p className={styles.text}>{card.text}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
