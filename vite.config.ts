import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Injeta <link rel="preload"> para os SVGs dos planetas no HTML de produção.
// Usa os nomes com hash gerados pelo Vite — funciona em dev como no-op
// (ctx.bundle é undefined em dev server).
function preloadPlanetSvgs(): Plugin {
  return {
    name: 'preload-planet-svgs',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        const links = Object.keys(ctx.bundle)
          .filter(name => /planeta-(amarelo|azul|verde)[^/]*\.svg$/.test(name))
          .map(name => `    <link rel="preload" href="/${name}" as="image" type="image/svg+xml">`)
          .join('\n')
        if (!links) return html
        return html.replace('</head>', `${links}\n  </head>`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), preloadPlanetSvgs()],
})
