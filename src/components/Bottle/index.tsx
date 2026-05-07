import { useState } from 'react'
import garrafaImg from '../../assets/images/garrafa.png'
import BottleLetter from './BottleLetter'
import styles from './Bottle.module.css'

export default function Bottle() {
  const [open, setOpen] = useState(false)

  return (
    /* container — centralização horizontal e margem superior aqui */
    <div className={styles.container}>
      <button
        className={styles.bottleBtn}
        onClick={() => setOpen(true)}
        aria-label="Abrir mensagem na garrafa"
      >
        {/* floatWrapper: animação de flutuação vertical */}
        <div className={styles.floatWrapper}>
          {/* bottle: animação de balanço rotacional */}
          <img className={styles.bottle} src={garrafaImg} alt="Garrafa com mensagem" />
        </div>
      </button>

      <BottleLetter open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
