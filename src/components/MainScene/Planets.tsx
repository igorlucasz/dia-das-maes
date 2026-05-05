import styles from './Planets.module.css'

// Glow pulsing is driven by per-planet delayed --audio-bass-{i} CSS vars
// set on :root by useAudioAnalyzer — no React re-renders needed.
export default function Planets() {
  return (
    <div className={styles.container}>

      {/* ── Planet 0: Roxo neon com anéis — top-left ── */}
      <div className={styles.wrapper0}>
        <div className={styles.glow0} />
        <div className={styles.ring0} />
        <div className={styles.planet0} />
      </div>

      {/* ── Planet 1: Verde ácido com lua orbitando — top-right ── */}
      <div className={styles.wrapper1}>
        <div className={styles.glow1} />
        <div className={styles.planet1} />
        <div className={styles.moonOrbit}>
          <div className={styles.moon} />
        </div>
      </div>

      {/* ── Planet 2: Rosa magenta com crateras — bottom-left ── */}
      <div className={styles.wrapper2}>
        <div className={styles.glow2} />
        <div className={styles.planet2} />
      </div>

      {/* ── Planet 3: Azul ciano gasoso — bottom-right ── */}
      <div className={styles.wrapper3}>
        <div className={styles.glow3} />
        <div className={styles.planet3} />
      </div>

    </div>
  )
}
