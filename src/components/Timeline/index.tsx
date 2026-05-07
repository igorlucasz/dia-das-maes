import TimelineCard from './TimelineCard'
import styles from './Timeline.module.css'

const CARDS: { date: string; position: 'left' | 'right' }[] = [
  { date: 'MAIO · 2007',     position: 'left'  },
  { date: 'JULHO · 2007',    position: 'right' },
  { date: 'DEZEMBRO · 2007', position: 'left'  },
  { date: 'MARÇO · 2008',    position: 'right' },
  { date: 'JUNHO · 2009',    position: 'left'  },
  { date: 'MAIO · 2025',     position: 'right' },
]

export default function Timeline() {
  return (
    <section className={styles.timeline} aria-label="Nossa história">
      <div className={styles.line} aria-hidden="true" />
      {CARDS.map((card, i) => (
        <TimelineCard key={i} date={card.date} position={card.position} />
      ))}
    </section>
  )
}
