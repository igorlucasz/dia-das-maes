import { motion } from 'framer-motion'
import AngelicAudioControls from './AngelicAudioControls'
import styles from './AngelicScene.module.css'

// Deterministic particle values — stable across renders
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 100}%`,
  animationDuration: `${8 + (i % 8)}s`,
  animationDelay: `-${((i * 73) % 150) / 10}s`,
  size: `${2 + (i % 3)}px`,
  opacity: 0.3 + (i % 4) * 0.075,
}))

interface Props {
  onGoBack: () => void
  skydance?: HTMLAudioElement | null
}

export default function AngelicScene({ onGoBack, skydance }: Props) {
  return (
    <div className={styles.scene}>
      <AngelicAudioControls skydance={skydance ?? null} />
      <div className={styles.particles} aria-hidden="true">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              left: p.left,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      <motion.button
        className={styles.backBtn}
        onClick={onGoBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        ← voltar
      </motion.button>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
      >
        <div className={styles.imagePlaceholder}>
          <span className={styles.placeholderIcon}>🌟</span>
          <span className={styles.placeholderText}>foto especial em breve</span>
        </div>

        <h1 className={styles.title}>Um momento especial</h1>

        <p className={styles.body}>
          Aqui viverá uma mensagem especial, guardada com carinho para este momento único e inesquecível.
        </p>
      </motion.div>
    </div>
  )
}
