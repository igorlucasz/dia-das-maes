export function fadeAudio(
  audio: HTMLAudioElement,
  targetVolume: number,
  durationMs: number,
  onComplete?: () => void
): ReturnType<typeof setInterval> {
  const startVolume = audio.volume
  const steps = Math.floor(durationMs / 50)
  const volumeStep = (targetVolume - startVolume) / steps
  let currentStep = 0

  const interval = setInterval(() => {
    currentStep++
    audio.volume = Math.max(0, Math.min(1, startVolume + volumeStep * currentStep))

    if (currentStep >= steps) {
      clearInterval(interval)
      audio.volume = targetVolume
      onComplete?.()
    }
  }, 50)

  return interval
}
