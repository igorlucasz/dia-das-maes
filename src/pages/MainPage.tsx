import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import MainScene from '../components/MainScene'
import AngelicScene from '../components/AngelicScene'

export default function MainPage() {
  const [showAngelic, setShowAngelic] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayPhase, setOverlayPhase] = useState<'in' | 'out'>('in')
  const pendingAngelic = useRef(false)

  function transitionTo(toAngelic: boolean) {
    pendingAngelic.current = toAngelic
    setOverlayPhase('in')
    setShowOverlay(true)
  }

  function handleOverlayDone() {
    if (overlayPhase === 'in') {
      setShowAngelic(pendingAngelic.current)
      setOverlayPhase('out')
    } else {
      setShowOverlay(false)
      setOverlayPhase('in')
    }
  }

  return (
    <>
      <MainScene
        onGoAngelic={() => transitionTo(true)}
        hidden={showAngelic}
      />
      {showAngelic && <AngelicScene onGoBack={() => transitionTo(false)} />}

      {showOverlay && (
        <motion.div
          key={overlayPhase}
          style={{ position: 'fixed', inset: 0, background: '#fffef7', zIndex: 999 }}
          initial={overlayPhase === 'in'
            ? { scaleY: 0, transformOrigin: 'bottom' }
            : { opacity: 1 }
          }
          animate={overlayPhase === 'in' ? { scaleY: 1 } : { opacity: 0 }}
          transition={overlayPhase === 'in'
            ? { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            : { duration: 0.6 }
          }
          onAnimationComplete={handleOverlayDone}
        />
      )}
    </>
  )
}
