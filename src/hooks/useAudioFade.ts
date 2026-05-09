export function fadeAudio(
  audio: HTMLAudioElement,
  targetVolume: number,
  durationMs: number,
  onComplete?: () => void
): ReturnType<typeof setInterval> {
  const startVolume = audio.volume
  const steps = Math.floor(durationMs / 50)
  const volumeStep = (targetVolume - startVolume) / steps
  // Exponential curve when both endpoints are non-zero: falls fast at the start,
  // tapers near the end — eliminates the audible cut on fade-out.
  // Linear fallback for fade-in (startVolume = 0) where the formula breaks.
  const useExponential = startVolume > 0 && targetVolume > 0
  let currentStep = 0

  const interval = setInterval(() => {
    currentStep++
    const progress = currentStep / steps

    audio.volume = useExponential
      ? Math.max(0, Math.min(1, startVolume * Math.pow(targetVolume / startVolume, progress)))
      : Math.max(0, Math.min(1, startVolume + volumeStep * currentStep))

    if (currentStep >= steps) {
      clearInterval(interval)
      audio.volume = targetVolume
      onComplete?.()
    }
  }, 50)

  return interval
}
