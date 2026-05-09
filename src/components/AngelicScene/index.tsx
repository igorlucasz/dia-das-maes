import { motion } from 'framer-motion'
import vo2 from '../../assets/images/vo2.jpg'
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
  initialVolume?: number
  onVolumeChange?: (v: number) => void
}

export default function AngelicScene({ onGoBack, skydance, initialVolume, onVolumeChange }: Props) {
  return (
    <div className={styles.scene}>
      <motion.div
        className={styles.angelicTopBar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <button className={styles.backBtn} onClick={onGoBack}>← voltar</button>
        <AngelicAudioControls
          skydance={skydance ?? null}
          initialVolume={initialVolume ?? 0.75}
          onVolumeChange={onVolumeChange}
        />
      </motion.div>

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

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
      >
        <img
          src={vo2}
          alt=""
          className={styles.photo}
          loading="eager"
        />

        <h1 className={styles.title}>Nós te amamos!</h1>

        <div className={styles.angelicText}>
          <p>
            É verdade que os últimos anos foram muito difíceis, você passou
            por coisas que poucos seres humanos já passaram, mas mesmo assim
            nunca abaixou a cabeça e seguiu corajosa como sempre. E assim,
            um dia após o outro, enfrentou a maior dificuldade da sua vida
            de frente! Com muita fé, você conseguiu e consegue a cada dia
            superar esses desafios.
          </p>
          <p>
            Tenha certeza, mãe, que eu e o Dono Lafaiete estamos orgulhosos
            de você! Nesse momento imagino ele no céu olhando pra tudo que
            você fez por ele com muita gratidão e tranquilidade no coração,
            porque a filha dele conseguiu honrá-lo de verdade. Agora, enfim,
            ele poderá descansar de verdade graças a você, mãe.
          </p>
          <p>
            <strong>Você, Maria Regina, é mais que a MELHOR MÃE, é a MELHOR FILHA DO MUNDO, OBRIGADO!</strong>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
