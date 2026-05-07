import { useState, useEffect } from 'react'

interface TimeCounter {
  days: number
  hours: number
  seconds: number
}

function calc(startDate: Date): TimeCounter {
  const diff = Math.max(0, Date.now() - startDate.getTime())
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const seconds = totalSeconds % 60
  return { days, hours, seconds }
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
