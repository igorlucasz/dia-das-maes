import { useState } from 'react'
import DateGate from './components/DateGate'
import MainScene from './components/MainScene'

type Screen = 'gate' | 'main'

export default function App() {
  const [screen, setScreen] = useState<Screen>('gate')

  if (screen === 'main') return <MainScene />
  return <DateGate onSuccess={() => setScreen('main')} />
}
