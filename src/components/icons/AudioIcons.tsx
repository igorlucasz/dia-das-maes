export function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <polygon points="3,1 15,8 3,15" />
    </svg>
  )
}

export function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="2" y="1" width="4" height="14" />
      <rect x="10" y="1" width="4" height="14" />
    </svg>
  )
}

export function VolumeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <polygon points="1,5 6,5 10,1 10,15 6,11 1,11" />
      <path d="M12,4 Q15,8 12,12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

export function MutedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <polygon points="1,5 6,5 10,1 10,15 6,11 1,11" />
      <line x1="12" y1="4" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
