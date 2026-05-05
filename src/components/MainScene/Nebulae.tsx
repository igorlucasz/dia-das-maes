import styles from './Nebulae.module.css'

// Manchas estáticas de alta opacidade+blur — criam atmosfera sem custo de animação
export default function Nebulae() {
  return (
    <div className={styles.container} aria-hidden="true">
      <div className={styles.nebula0} />
      <div className={styles.nebula1} />
      <div className={styles.nebula2} />
    </div>
  )
}
