import { motion } from 'framer-motion'
import styles from './MainScene.module.css'

export default function MainScene() {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <p className={styles.label}>Bem-vinda 🌟</p>
      <p className={styles.sub}>A cena principal vem na próxima etapa…</p>
    </motion.div>
  )
}
