import { useState } from 'react'
import TimelineCard from './TimelineCard'
import TimelineModal from './TimelineModal'
import styles from './Timeline.module.css'

export interface CardData {
  date: string
  position: 'left' | 'right'
  text: string
}

const CARDS: CardData[] = [
  { date: 'MAIO · 2007',     position: 'left',  text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { date: 'JULHO · 2007',    position: 'right', text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { date: 'DEZEMBRO · 2007', position: 'left',  text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { date: 'MARÇO · 2008',    position: 'right', text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { date: 'JUNHO · 2009',    position: 'left',  text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { date: 'MAIO · 2025',     position: 'right', text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
]

export default function Timeline() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <>
      <section className={styles.timeline} aria-label="Nossa história">
        <div className={styles.line} aria-hidden="true" />
        {CARDS.map((card, i) => (
          <TimelineCard
            key={i}
            date={card.date}
            text={card.text}
            position={card.position}
            onClick={() => setExpandedId(i)}
          />
        ))}
      </section>

      <TimelineModal
        card={expandedId !== null ? CARDS[expandedId] : null}
        onClose={() => setExpandedId(null)}
      />
    </>
  )
}
