import { useState } from 'react'
import DateGate from './components/DateGate'
import MainScene from './components/MainScene'
import EasterEgg from './components/EasterEgg'

type Screen = 'gate' | 'main' | 'easter'

export default function App() {
  const [screen, setScreen] = useState<Screen>('gate')

  if (screen === 'main') return <MainScene />
  if (screen === 'easter') return <EasterEgg />
  return <DateGate onSuccess={(destination) => setScreen(destination)} />
}
