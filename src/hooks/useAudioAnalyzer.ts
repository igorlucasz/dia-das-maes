import { RefObject, MutableRefObject, useEffect, useRef } from 'react'

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
// Returns ctxRef so callers can invoke ctx.resume() on user gestures.
export function useAudioAnalyzer(
  audioRef: RefObject<HTMLAudioElement>
): MutableRefObject<AudioContext | null> {
  const rafRef = useRef<number>(0)
  const bassHistory = useRef<number[]>(new Array(HISTORY_LEN).fill(0))
  const ctxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  // Defers ctx.close() past the StrictMode remount (macrotask fires after the
  // synchronous cleanup+remount cycle, so the new effect can cancel it and
  // reuse the intact pipeline instead of creating a second broken one).
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // If this is a StrictMode remount, cancel the deferred close and reuse
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
      console.log('[AUDIO_DEBUG] StrictMode remount detected — cancelled ctx.close(), reusing pipeline')
    }

    const audio = audioRef.current
    if (!audio) return

    const root = document.documentElement

    const existingCtx = ctxRef.current
    const existingAnalyser = analyserRef.current

    let ctx: AudioContext
    let analyser: AnalyserNode

    if (existingCtx && existingCtx.state !== 'closed' && existingAnalyser) {
      // Reuse pipeline kept open by the deferred close above
      ctx = existingCtx
      analyser = existingAnalyser
      try {
        analyser.connect(ctx.destination)
        console.log('[AUDIO_DEBUG] Analyser reconnected to destination (reuse path)')
      } catch {
        // already connected — fine
      }
    } else {
      // Fresh setup
      let newCtx: AudioContext
      try {
        newCtx = new AudioContext()
      } catch (e) {
        console.error('[AUDIO_DEBUG] new AudioContext() failed:', e)
        return
      }
      console.log(`[AUDIO_DEBUG] AudioContext created — state: ${newCtx.state}`)
      ctxRef.current = newCtx

      const newAnalyser = newCtx.createAnalyser()
      newAnalyser.fftSize = 2048
      newAnalyser.smoothingTimeConstant = 0.75
      analyserRef.current = newAnalyser

      try {
        const source = newCtx.createMediaElementSource(audio)
        source.connect(newAnalyser)
        newAnalyser.connect(newCtx.destination)
        console.log('[AUDIO_DEBUG] Pipeline connected: audio → source → analyser → destination ✓')
      } catch (e) {
        console.error('[AUDIO_DEBUG] createMediaElementSource failed (pipeline broken):', e)
        newCtx.close()
        ctxRef.current = null
        analyserRef.current = null
        return
      }

      ctx = newCtx
      analyser = newAnalyser
    }

    ctx.resume()
      .then(() => console.log(`[AUDIO_DEBUG] ctx.resume() resolved — state: ${ctx.state}`))
      .catch(e => console.warn('[AUDIO_DEBUG] ctx.resume() failed (needs user gesture):', e))

    const data = new Uint8Array(analyser.frequencyBinCount)

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
      root.style.removeProperty('--audio-mids')
      root.style.removeProperty('--audio-treble')
      for (let i = 0; i < 4; i++) root.style.removeProperty(`--audio-bass-${i}`)
      // Defer the close — if StrictMode remounts us before this macrotask fires,
      // the new effect will clearTimeout and reuse the intact pipeline.
      closeTimerRef.current = setTimeout(() => {
        closeTimerRef.current = null
        console.log('[AUDIO_DEBUG] ctx.close() — real unmount confirmed')
        ctxRef.current?.close()
        ctxRef.current = null
        analyserRef.current = null
      }, 0)
    }
  // audioRef is a stable object — intentional empty deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ctxRef
}
