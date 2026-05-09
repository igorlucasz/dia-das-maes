import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './BottleLetter.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

export default function BottleLetter({ open, onClose }: Props) {
  const [paperOpen, setPaperOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) {
      setPaperOpen(false)
      setClosing(false)
    }
  }, [open])

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
              >
                <div className={styles.letterContainer}>
                  <h2 className={styles.letterTitle}>Nossos agradecimentos😉</h2>
                  <div className={styles.letterDivider} />

                  <div className={styles.letterBody}>
                    <p>
                      Oi tikiwiki, acho que já ficou claro o quanto eu e meu pai te amamos.
                      Então essa mensagem aqui é uma forma de agradecermos por TUDO que você
                      fez e AINDA FAZ todos os dias da sua vida.
                    </p>

                    <p>
                      Mãe, você é a melhor coisa que já aconteceu na minha vida! A pessoa
                      mais engraçada, mais divertida, mais carinhosa, mais atenciosa e a que
                      mais me faz sorrir mesmo em momentos ruins é você. A definição de ser
                      mãe não poderia estar mais bem representada! Ser mãe vai muito além do
                      que cuidar de seu filho, tem a ver com todas as vezes que você teve
                      paciência comigo pra explicar o motivo do que eu fiz ser errado, em vez
                      de ficar gritando e brigando quando eu era pequeno; com todas as viagens
                      que fizemos juntos e você pensou em cada detalhe para aqueles momentos
                      se tornarem memórias boas; com todas as vezes que você foi em minhas
                      apresentações da escola toda produzida e arrumada só pra me ver; todas
                      as vezes que você se empolgou junto comigo pra arrumar fantasia pro
                      halloween, pintar meu cabelo pro dia do cabelo maluco, achar uma roupa
                      pra festa junina, ou qualquer outra maluquice que você entrou de ponta
                      cabeça comigo; com todas as vezes que você me tranquilizou porque eu
                      estava ansioso com alguma prova; com todas as vezes que você disse que
                      eu não precisava ser perfeito porque me cobrava demais; com todas as
                      vezes que você sorriu pra mim e me animou em dias mais difíceis; com
                      todas as vezes que você demonstrou amar e se importar comigo e com meu
                      pai. Tudo isso, tudo que você fez até os dias de hoje, me moldou como
                      pessoa e me fez enxergar o mundo de uma forma muito mais leve e feliz.
                      Você melhorou e melhora constantemente a minha vida.
                    </p>

                    <p>
                      Obrigado por ser tão carinhosa. Obrigado por ser tão compreensiva.
                      Obrigado por se preocupar. Obrigado por cuidar de mim. Obrigado por
                      amar tanto. Obrigado por cada sorriso. Obrigado por cada abraço.
                      Você é e sempre foi a MELHOR MÃE e a MELHOR ESPOSA. OBRIGADO!
                    </p>
                  </div>

                  <div className={styles.letterFooter}>
                    <em>Com amor, Igor e Márcio</em>🫶
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
