import { RefObject, useEffect, useRef } from 'react'

// At 44100 Hz sample rate with FFT size 2048 → 1024 bins, ~43 Hz per bin
const BASS_END = 6    // ~0–258 Hz
const MIDS_END = 47   // ~258–2021 Hz
const TREBLE_END = 188 // ~2021–8084 Hz

// Per-planet bass delay: planets 0–3 get 0, 3, 5, 8 frames of history (~0, 50, 83, 133 ms)
const PLANET_DELAY_FRAMES = [0, 3, 5, 8] as const

const HISTORY_LEN = 10

function avg(data: Uint8Array, start: number, end: number): number {
  let sum = 0
  for (let i = start; i < end; i++) sum += data[i]
  return sum / ((end - start) * 255)
}

// Updates CSS custom properties on :root every animation frame so child
// components can react via pure CSS calc() — zero React re-renders at runtime.
export function useAudioAnalyzer(audioRef: RefObject<HTMLAudioElement>): void {
  const rafRef = useRef<number>(0)
  const bassHistory = useRef<number[]>(new Array(HISTORY_LEN).fill(0))

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let ctx: AudioContext
    try {
      ctx = new AudioContext()
    } catch {
      return
    }

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.75

    try {
      const source = ctx.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(ctx.destination)
    } catch {
      // Already connected (React StrictMode double-invoke in dev). Close and bail.
      ctx.close()
      return
    }

    // Resume in case browser auto-suspended the context (common on mobile).
    ctx.resume().catch(() => {})

    const data = new Uint8Array(analyser.frequencyBinCount)
    const root = document.documentElement

    function tick() {
      rafRef.current = requestAnimationFrame(tick)

      if (ctx.state !== 'running') return

      analyser.getByteFrequencyData(data)

      const bass = avg(data, 1, BASS_END)
      const mids = avg(data, BASS_END, MIDS_END)
      const treble = avg(data, MIDS_END, TREBLE_END)

      // Prepend and cap history
      bassHistory.current.unshift(bass)
      if (bassHistory.current.length > HISTORY_LEN) bassHistory.current.pop()

      root.style.setProperty('--audio-mids', mids.toFixed(4))
      root.style.setProperty('--audio-treble', treble.toFixed(4))

      // Each planet gets a slightly delayed bass reading for de-sync effect
      PLANET_DELAY_FRAMES.forEach((frame, i) => {
        const delayed = bassHistory.current[frame] ?? 0
        root.style.setProperty(`--audio-bass-${i}`, delayed.toFixed(4))
      })
    }

    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      try { analyser.disconnect() } catch { /* ignore */ }
      ctx.close()
      // Clear vars so CSS fallbacks take over immediately
      root.style.removeProperty('--audio-mids')
      root.style.removeProperty('--audio-treble')
      for (let i = 0; i < 4; i++) root.style.removeProperty(`--audio-bass-${i}`)
    }
  // audioRef is a stable object — intentional empty deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
