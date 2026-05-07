import { useState } from 'react'
import garrafaImg from '../../assets/images/garrafa.png'
import BottleLetter from './BottleLetter'
import styles from './Bottle.module.css'

interface Props {
  onOpen?: () => void
  onClose?: () => void
}

export default function Bottle({ onOpen, onClose }: Props) {
  const [open, setOpen] = useState(false)

  function handleOpen() {
    setOpen(true)
    onOpen?.()
  }

  function handleClose() {
    setOpen(false)
    onClose?.()
  }

  return (
    /* container — centralização horizontal e margem superior aqui */
    <div className={styles.container}>
      <button
        className={styles.bottleBtn}
        onClick={handleOpen}
        aria-label="Abrir mensagem na garrafa"
      >
        {/* floatWrapper: animação de flutuação vertical */}
        <div className={styles.floatWrapper}>
          {/* bottle: animação de balanço rotacional */}
          <img className={styles.bottle} src={garrafaImg} alt="Garrafa com mensagem" />
        </div>
      </button>

      <BottleLetter open={open} onClose={handleClose} />
    </div>
  )
}
