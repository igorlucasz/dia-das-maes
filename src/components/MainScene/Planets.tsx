import styles from './Planets.module.css'

// Glow pulsing: CSS vars --audio-bass-{0-3} atualizados pelo useAudioAnalyzer
// Drift: keyframe CSS puro (transform:translate) — GPU-composited, sem JS
export default function Planets() {
  return (
    <div className={styles.container}>

      {/* ── Planeta 0 — Roxo neon com dois anéis — 1ª viewport esquerda ── */}
      <div className={styles.wrapper0}>
        <div className={styles.glow0} />
        <div className={styles.ring0b} />
        <div className={styles.ring0} />
        <div className={styles.planet0} />
      </div>

      {/* ── Planeta 1 — Verde ácido com lua orbitando — 1ª viewport direita ── */}
      <div className={styles.wrapper1}>
        <div className={styles.glow1} />
        <div className={styles.planet1} />
        <div className={styles.moonOrbit}>
          <div className={styles.moon} />
        </div>
      </div>

      {/* ── Planeta 2 — Rosa magenta texturizado com aura ciano — 2ª viewport ── */}
      <div className={styles.wrapper2}>
        <div className={styles.glow2} />
        <div className={styles.planet2} />
      </div>

      {/* ── Planeta 3 — Azul ciano gasoso (maior) — 2ª viewport ── */}
      <div className={styles.wrapper3}>
        <div className={styles.glow3} />
        <div className={styles.planet3} />
      </div>

      {/* ── Planeta 4 — Coral cristalino (gem) — 3ª viewport ── */}
      <div className={styles.wrapper4}>
        <div className={styles.glow4} />
        <div className={styles.planet4} />
      </div>

    </div>
  )
}
