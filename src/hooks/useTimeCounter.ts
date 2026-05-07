import { useState, useEffect } from 'react'

export interface TimeCounter {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calc(startDate: Date): TimeCounter {
  const diff = Math.max(0, Math.floor((Date.now() - startDate.getTime()) / 1000))
  const days    = Math.floor(diff / 86400)
  const hours   = Math.floor((diff % 86400) / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60
  return { days, hours, minutes, seconds }
}

export function useTimeCounter(startDate: Date): TimeCounter {
  const [counter, setCounter] = useState<TimeCounter>(() => calc(startDate))

  useEffect(() => {
    const id = setInterval(() => setCounter(calc(startDate)), 1000)
    return () => clearInterval(id)
  // startDate é uma constante de módulo — estável, seguro omitir da dep array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return counter
}
