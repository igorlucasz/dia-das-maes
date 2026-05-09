import { useState } from 'react'

export function useBottleUnlock() {
  const [unlocked, setUnlocked] = useState(() => {
    return localStorage.getItem('bottle_opened') === 'true'
  })

  function unlock() {
    localStorage.setItem('bottle_opened', 'true')
    setUnlocked(true)
  }

  return { unlocked, unlock }
}
