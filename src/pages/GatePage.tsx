import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DateGate from '../components/DateGate'
import EasterEgg from '../components/EasterEgg'

export default function GatePage() {
  const navigate = useNavigate()
  const [showEaster, setShowEaster] = useState(false)

  if (showEaster) return <EasterEgg />

  return (
    <DateGate
      onSuccess={(dest) => {
        if (dest === 'main') navigate('/main')
        else setShowEaster(true)
      }}
    />
  )
}
