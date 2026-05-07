import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './BottleLetter.module.css'

const FULL_TEXT =
  'Mãe, existem palavras que o coração guarda há tempo demais para não dizer. Esta mensagem é uma delas...'
const CHAR_DELAY_MS = 40

interface Props {
  open: boolean
  onClose: () => void
}

export default function BottleLetter({ open, onClose }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) {
      setDisplayed('')
      setDone(false)
      return
    }
    let i = 0
    function type() {
      i++
      setDisplayed(FULL_TEXT.slice(0, i))
      if (i < FULL_TEXT.length) {
        timerRef.current = setTimeout(type, CHAR_DELAY_MS)
      } else {
        setDone(true)
      }
    }
    // small delay so the enter animation plays first
    timerRef.current = setTimeout(type, 350)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.letter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>

            <div className={styles.header}>
              <span className={styles.headerIcon}>🌊</span>
              <div className={styles.headerLine} />
            </div>

            <p className={styles.text}>
              {displayed}
              {!done && <span className={styles.cursor} aria-hidden="true">|</span>}
            </p>

            <AnimatePresence>
              {done && (
                <motion.div
                  className={styles.footer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={styles.footerLine} />
                  <p className={styles.signature}>Com amor, Igor 🚀</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
