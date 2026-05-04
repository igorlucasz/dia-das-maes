import styles from './DateGate.module.css'

// Strip non-digits and format as DD/MM/AAAA
function applyMask(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

interface Props {
  value: string
  onChange: (value: string) => void
  disabled: boolean
  onSubmit: () => void
}

export default function DateInput({ value, onChange, disabled, onSubmit }: Props) {
  return (
    <input
      className={styles.input}
      type="text"
      inputMode="numeric"
      placeholder="DD/MM/AAAA"
      value={value}
      disabled={disabled}
      maxLength={10}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      onChange={e => onChange(applyMask(e.target.value))}
      onKeyDown={e => e.key === 'Enter' && onSubmit()}
    />
  )
}
