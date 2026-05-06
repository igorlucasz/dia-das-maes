import styles from './Planets.module.css'
import planetaAmarelo from '../../assets/images/planeta-amarelo.svg'
import planetaAzul from '../../assets/images/planeta-azul.svg'
import planetaVerde from '../../assets/images/planeta-verde.svg'
import nebulaVibrante from '../../assets/images/nebula-vibrante.svg'

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

      {/* ── Planeta 1 — Verde (imagem SVG) — 1ª viewport direita ── */}
      <div className={styles.wrapper1}>
        <div className={styles.glow1} />
        <div className={styles.planet1}>
          <img
            src={planetaVerde}
            alt="Planeta verde esmeralda"
            className={styles.planetImg}
            loading="eager"
          />
        </div>
      </div>

      {/* ── Planeta 2 — Rosa magenta texturizado com aura ciano — 2ª viewport ── */}
      <div className={styles.wrapper2}>
        <div className={styles.glow2} />
        <div className={styles.planet2} />
        <img
          src={nebulaVibrante}
          alt=""
          aria-hidden="true"
          className={styles.nebula2}
        />
      </div>

      {/* ── Planeta 3 — Azul gigante gasoso (maior) — 2ª viewport ── */}
      <div className={styles.wrapper3}>
        <div className={styles.glow3} />
        <div className={styles.planet3}>
          <img
            src={planetaAzul}
            alt="Planeta azul gigante gasoso"
            className={styles.planetImg}
            loading="eager"
          />
        </div>
        <div className={styles.moonOrbit1}><div className={styles.moon1} /></div>
        <div className={styles.moonOrbit2}><div className={styles.moon2} /></div>
        <div className={styles.moonOrbit3}><div className={styles.moon3} /></div>
      </div>

      {/* ── Planeta 4 — Amarelo cristalino — 3ª viewport ── */}
      <div className={styles.wrapper4}>
        <div className={styles.glow4} />
        <div className={styles.planet4}>
          <img
            src={planetaAmarelo}
            alt="Planeta dourado cristalino"
            className={styles.planetImg}
            loading="eager"
          />
        </div>
        {/* Partículas de energia/fogo ao redor — posicionadas na borda do planeta */}
        <div className={`${styles.particle} ${styles.fp1}`} />
        <div className={`${styles.particle} ${styles.fp2}`} />
        <div className={`${styles.particle} ${styles.fp3}`} />
        <div className={`${styles.particle} ${styles.fp4}`} />
        <div className={`${styles.particle} ${styles.fp5}`} />
        <div className={`${styles.particle} ${styles.fp6}`} />
        <div className={`${styles.particle} ${styles.fp7}`} />
        <div className={`${styles.particle} ${styles.fp8}`} />
      </div>

    </div>
  )
}
