import styles from './Constellations.module.css'

// Coordenadas em % do container (x: largura, y: altura total da página).
// O SVG ocupa position:absolute inset:0 → escala automaticamente com --page-height.
const CONSTELLATIONS = [
  {
    // Constelação A — área superior central, entre os dois planetas do topo
    stars: [
      { x: 38, y: 3.2 },
      { x: 45, y: 6.8 },
      { x: 42, y: 11.4 },
      { x: 52, y: 9.0 },
      { x: 57, y: 4.5 },
      { x: 53, y: 13.2 },
    ],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [3, 5]] as [number, number][],
    animOffset: 0,
  },
  {
    // Constelação B — área média-baixa esquerda, região da 3ª viewport
    stars: [
      { x: 22, y: 68.5 },
      { x: 28, y: 71.8 },
      { x: 25, y: 77.0 },
      { x: 33, y: 74.2 },
      { x: 37, y: 69.6 },
      { x: 30, y: 80.5 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [1, 3], [3, 4], [4, 0], [2, 5], [3, 5]] as [number, number][],
    animOffset: 3.5,
  },
]

export default function Constellations() {
  return (
    // SVG cobre o container inteiro; % em cx/cy é relativo às dimensões do SVG
    <svg className={styles.svg} aria-hidden="true">
      {CONSTELLATIONS.map((c, ci) => (
        <g key={ci}>
          {c.lines.map(([a, b], li) => (
            <line
              key={li}
              x1={`${c.stars[a].x}%`}
              y1={`${c.stars[a].y}%`}
              x2={`${c.stars[b].x}%`}
              y2={`${c.stars[b].y}%`}
              className={styles.line}
              style={{ animationDelay: `${c.animOffset + li * 0.4}s` }}
            />
          ))}
          {c.stars.map((star, si) => (
            <circle
              key={si}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r="2"
              className={styles.star}
              style={{ animationDelay: `${c.animOffset + si * 0.25}s` }}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
