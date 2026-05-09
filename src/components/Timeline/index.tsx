import { useState, useEffect } from 'react'
import TimelineCard from './TimelineCard'
import TimelineModal from './TimelineModal'
import styles from './Timeline.module.css'

import eu1 from '../../assets/images/eu1.jpg'
import eu2 from '../../assets/images/eu2.jpg'
import mae1 from '../../assets/images/mae1.jpg'
import mae2 from '../../assets/images/mae2.jpg'
import mae3 from '../../assets/images/mae3.jpg'
import mae4 from '../../assets/images/mae4.jpg'
import mae5 from '../../assets/images/mae5.jpg'
import gramado from '../../assets/images/gramado.jpg'
import vo3 from '../../assets/images/vo3.jpg'
import fam1 from '../../assets/images/fam1.jpg'
import fam2 from '../../assets/images/fam2.jpg'
import fam3 from '../../assets/images/fam3.jpg'
import fam4 from '../../assets/images/fam4.jpg'
import aleg1 from '../../assets/images/aleg1.jpg'
import aleg2 from '../../assets/images/aleg2.jpg'
import aleg3 from '../../assets/images/aleg3.jpg'
import aleg4 from '../../assets/images/aleg4.jpg'
import aleg5 from '../../assets/images/aleg5.jpg'
import aleg6 from '../../assets/images/aleg6.jpg'

export interface CardData {
  title: string
  position: 'left' | 'right'
  text: string
  photos: string[]
}

const CARDS: CardData[] = [
  {
    title: 'Maio | 2007',
    position: 'left',
    photos: [eu1, eu2],
    text: `Tudo começou quando eu nasci! Desde pequeno já me senti muito amado por você, mãe. A forma como você era paciente comigo, nunca brigando mas sempre explicando com muito carinho quando eu fazia algo de errado kkkk, fez toda diferença! Nunca me bateu e sempre cuidou de mim, OBRIGADO, MÃE!`,
  },
  {
    title: 'Viagens✈️',
    position: 'right',
    photos: [mae4, mae5, gramado],
    text: `As viagens que a gente faz são as melhores! Dava pra ver o quanto você gostava e, sobretudo, se importava com cada detalhe para deixar o momento mais especial ainda. Só não sei se você percebeu que só o fato de você estar presente, mãe, torna o momento especial automaticamente! Tenho muita gratidão por isso, OBRIGADO, MÃE!`,
  },
  {
    title: 'Escola🏫',
    position: 'left',
    photos: [mae1, mae3],
    text: `Algo que me marcou MUITO, foram os eventos do Logosófico e do São José! Mas mais importante ainda que os próprios eventos era o fato que você, mãe, estava lá em todos eles. Até hoje, recordo da sensação que era ver você chegando nessas festas/comemorações que tinham, eu reparava em cada detalhe: a dedicação em vestir uma roupa, que eu achava muito bonita (porque isso você faz muitoo bem kkkk), em maquiar e, acima de tudo, o sorriso e a felicidade genuína que você trazia! Pode ter certeza que me sentia muito amado por você, OBRIGADO, MÃE!`,
  },
  {
    title: 'Festas🥳',
    position: 'right',
    photos: [mae2, vo3, fam4],
    text: `Você, Maria Regina, é a pessoa mais animada que eu conheço pra farra kkkkk. Tanto que quando eu era mais novo, você fazia as MELHORES FESTAS que uma criança poderia ter! Era muito especial a forma como você organizava tudo e se empenhava, tudo para arrancar um sorriso de mim. Tinha o maior cuidado do mundo pra me agradar e fazer tudo do jeito que eu queria, OBRIGADO, MÃE!`,
  },
  {
    title: 'Alegria😁',
    position: 'left',
    photos: [aleg1, aleg2, aleg3, aleg4, aleg5, aleg6],
    text: `Esse é meu quadro favorito kkkkk. Fiz questão de juntar algumas fotos que eu consigo ver a PRINCIPAL característica e qualidade sua, que é... A ALEGRIA! Esse serzinho tão especial chamado Maria Regina tem um brilho MUITOOOO grande, de verdade, você é uma pessoa que é diferente de todas que eu já conheci na minha vida, justamente por ter um sorriso e uma alegria que carrega com você 24h por dia. E isso, não sou só eu que vejo, tenho certeza! Não importa onde você vá, sempre leva uma leveza que é capaz de fazer até a pessoa mais triste do mundo sorrir, OBRIGADO POR SER ASSIM, MÃE!`,
  },
  {
    title: 'Amor❤️',
    position: 'right',
    photos: [fam1, fam2, fam3],
    text: `Por fim, o que seria melhor do que falar de amor, né. Nós, sua família verdadeira, só temos a agradecer por amar! Você tem a maior capacidade de amar e se importar com os outros, um coração imenso com certeza. Quem está perto de você, pode sentir isso de verdade na flor da pele! Cada um dos detalhes nas suas ações diárias tanto com nós (eu e meu pai) quanto com seus pais é a maior prova do GRANDEEE AMOR que você oferece todos os dias, OBRIGADO, MÃE!`,
  },
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
