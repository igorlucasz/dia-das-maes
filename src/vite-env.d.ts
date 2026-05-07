/// <reference types="vite/client" />

/* React 18.3+ espera fetchpriority (lowercase) no DOM, mas @types/react ainda
   não inclui a forma minúscula — augmentation necessária para compilar. */
import 'react'
declare module 'react' {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto'
  }
}

declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.mp3' {
  const src: string
  export default src
}
