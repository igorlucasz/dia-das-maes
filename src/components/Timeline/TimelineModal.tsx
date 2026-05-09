import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { CardData } from './index'
import styles from './TimelineModal.module.css'

interface Props {
  card: CardData | null
  photoIndex: number
  onPhotoChange: (index: number) => void
  onClose: () => void
}

export default function TimelineModal({ card, photoIndex, onPhotoChange, onClose }: Props) {
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

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

  const prevPhoto = () => {
    if (!card || card.photos.length <= 1) return
    onPhotoChange((photoIndex - 1 + card.photos.length) % card.photos.length)
  }

  const nextPhoto = () => {
    if (!card || card.photos.length <= 1) return
    onPhotoChange((photoIndex + 1) % card.photos.length)
  }

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
            <p className={styles.date}>{card.title}</p>

            {card.photos.length > 0 && (
              <div
                className={styles.photoContainer}
                onTouchStart={e => {
                  touchStartX.current = e.touches[0].clientX
                  touchStartY.current = e.touches[0].clientY
                }}
                onTouchEnd={e => {
                  const diffX = touchStartX.current - e.changedTouches[0].clientX
                  const diffY = touchStartY.current - e.changedTouches[0].clientY
                  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) nextPhoto()
                    else prevPhoto()
                  }
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={card.photos[photoIndex]}
                    alt=""
                    className={styles.photo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    loading="eager"
                  />
                </AnimatePresence>

                {card.photos.length > 1 && (
                  <>
                    <button
                      className={`${styles.arrow} ${styles.arrowLeft}`}
                      onClick={e => { e.stopPropagation(); prevPhoto() }}
                      aria-label="Foto anterior"
                    >‹</button>
                    <button
                      className={`${styles.arrow} ${styles.arrowRight}`}
                      onClick={e => { e.stopPropagation(); nextPhoto() }}
                      aria-label="Próxima foto"
                    >›</button>
                  </>
                )}
              </div>
            )}

            <p className={styles.text}>{card.text}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
