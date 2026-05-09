import { useEffect, useState } from 'react'
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

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 1 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 1 }),
}

function paginateText(text: string, charsPerPage = 200): string[] {
  const words = text.split(' ')
  const pages: string[] = []
  let current = ''

  for (const word of words) {
    if ((current + ' ' + word).trim().length > charsPerPage) {
      pages.push(current.trim())
      current = word
    } else {
      current = (current + ' ' + word).trim()
    }
  }
  if (current) pages.push(current.trim())
  return pages
}

export default function TimelineModal({ card, photoIndex, onPhotoChange, onClose }: Props) {
  const [direction, setDirection] = useState(0)
  const [textPage, setTextPage] = useState(0)

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
    setTextPage(0)
  }, [card])

  useEffect(() => {
    setTextPage(0)
  }, [photoIndex])

  useEffect(() => {
    if (!card) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [card, onClose])

  const prevPhoto = () => {
    if (!card || card.photos.length <= 1) return
    setDirection(-1)
    onPhotoChange((photoIndex - 1 + card.photos.length) % card.photos.length)
  }

  const nextPhoto = () => {
    if (!card || card.photos.length <= 1) return
    setDirection(1)
    onPhotoChange((photoIndex + 1) % card.photos.length)
  }

  const pages = card ? paginateText(card.text) : []
  const totalPages = pages.length

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
              <div className={styles.photoContainer}>
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={photoIndex}
                    src={card.photos[photoIndex]}
                    alt=""
                    className={styles.photo}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -50) nextPhoto()
                      else if (info.offset.x > 50) prevPhoto()
                    }}
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

            <p className={styles.text}>{pages[textPage]}</p>

            {totalPages > 1 && (
              <div className={styles.textPagination}>
                <button
                  className={styles.pageBtn}
                  onClick={e => { e.stopPropagation(); setTextPage(p => Math.max(0, p - 1)) }}
                  disabled={textPage === 0}
                  aria-label="Página anterior"
                >‹</button>
                <span className={styles.pageIndicator}>{textPage + 1}/{totalPages}</span>
                <button
                  className={styles.pageBtn}
                  onClick={e => { e.stopPropagation(); setTextPage(p => Math.min(totalPages - 1, p + 1)) }}
                  disabled={textPage === totalPages - 1}
                  aria-label="Próxima página"
                >›</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
