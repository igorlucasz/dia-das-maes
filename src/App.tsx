import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import DateGate from './components/DateGate'
import MainScene from './components/MainScene'
import EasterEgg from './components/EasterEgg'
import AngelicScene from './components/AngelicScene'

type Screen = 'gate' | 'main' | 'angelic' | 'easter'

export default function App() {
  const [screen, setScreen] = useState<Screen>('gate')
  const [showOverlay, setShowOverlay] = useState(false)
  const [overlayPhase, setOverlayPhase] = useState<'in' | 'out'>('in')
  const pendingScreen = useRef<Screen>('main')

  function transitionTo(next: Screen) {
    pendingScreen.current = next
    setOverlayPhase('in')
    setShowOverlay(true)
  }

  function handleOverlayDone() {
    if (overlayPhase === 'in') {
      setScreen(pendingScreen.current)
      setOverlayPhase('out')
    } else {
      setShowOverlay(false)
      setOverlayPhase('in')
    }
  }

  return (
    <>
      {screen === 'gate' && <DateGate onSuccess={(dest) => setScreen(dest)} />}
      {screen === 'main' && <MainScene onGoAngelic={() => transitionTo('angelic')} />}
      {screen === 'angelic' && <AngelicScene onGoBack={() => transitionTo('main')} />}
      {screen === 'easter' && <EasterEgg />}

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
