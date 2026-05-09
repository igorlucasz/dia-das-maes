import { useState, useEffect } from 'react'
import TimelineCard from './TimelineCard'
import TimelineModal from './TimelineModal'
import styles from './Timeline.module.css'

export interface CardData {
  title: string
  position: 'left' | 'right'
  text: string
  photos: string[]
}

const CARDS: CardData[] = [
  { title: 'MAIO · 2007',     position: 'left',  photos: [], text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { title: 'JULHO · 2007',    position: 'right', photos: [], text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { title: 'DEZEMBRO · 2007', position: 'left',  photos: [], text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { title: 'MARÇO · 2008',    position: 'right', photos: [], text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { title: 'JUNHO · 2009',    position: 'left',  photos: [], text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
  { title: 'MAIO · 2025',     position: 'right', photos: [], text: 'Texto placeholder que será substituído com a memória real deste momento especial.' },
]

export default function Timeline() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [globalPhotoIndex, setGlobalPhotoIndex] = useState(0)
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalPhotoIndex(prev => prev + 1)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleCardClick = (i: number) => {
    const card = CARDS[i]
    setModalPhotoIndex(card.photos.length > 0 ? globalPhotoIndex % card.photos.length : 0)
    setExpandedId(i)
  }

  return (
    <>
      <section className={styles.timeline} aria-label="Nossa história">
        <div className={styles.line} aria-hidden="true" />
        {CARDS.map((card, i) => (
          <TimelineCard
            key={i}
            title={card.title}
            text={card.text}
            photos={card.photos}
            position={card.position}
            globalPhotoIndex={globalPhotoIndex}
            onClick={() => handleCardClick(i)}
          />
        ))}
      </section>

      <TimelineModal
        card={expandedId !== null ? CARDS[expandedId] : null}
        photoIndex={modalPhotoIndex}
        onPhotoChange={setModalPhotoIndex}
        onClose={() => setExpandedId(null)}
      />
    </>
  )
}
