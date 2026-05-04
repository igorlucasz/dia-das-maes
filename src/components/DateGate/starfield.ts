export interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkle: boolean
  delay: number
}

export function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.6 + 0.4,
    twinkle: Math.random() > 0.55,
    delay: Math.random() * 4,
  }))
}
