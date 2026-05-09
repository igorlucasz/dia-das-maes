import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [paperOpen, setPaperOpen] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      setDisplayed('')
      setDone(false)
      setPaperOpen(false)
      setContentVisible(false)
      setClosing(false)
    }
  }, [open])

  useEffect(() => {
    if (!contentVisible) return
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
    timerRef.current = setTimeout(type, 100)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [contentVisible])

  const handleClose = useCallback(() => {
    if (closing) return
    setClosing(true)
    closeTimerRef.current = setTimeout(onClose, 450)
  }, [closing, onClose])

  useEffect(() => {
    if (open) {
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
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }
  }, [])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
        >
          <div className={styles.perspective}>
            <motion.div
              className={styles.paper}
              initial={{ scaleY: 0.5 }}
              animate={{ scaleY: closing ? 0.5 : 1 }}
              transition={
                closing
                  ? { delay: 0.15, duration: 0.3, ease: 'easeIn' }
                  : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }
              style={{ transformOrigin: 'top center' }}
              onAnimationComplete={() => {
                if (!closing && open) setPaperOpen(true)
              }}
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                className={styles.foldLine}
                animate={{ opacity: paperOpen && !closing ? 0 : 1 }}
                transition={{ duration: 0.4 }}
              />

              <button className={styles.closeBtn} onClick={handleClose} aria-label="Fechar">✕</button>

              <motion.div
                className={styles.content}
                animate={{ opacity: closing ? 0 : (paperOpen ? 1 : 0) }}
                initial={{ opacity: 0 }}
                transition={{ duration: closing ? 0.15 : 0.4 }}
                onAnimationComplete={() => {
                  if (paperOpen && !closing) setContentVisible(true)
                }}
              >
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
