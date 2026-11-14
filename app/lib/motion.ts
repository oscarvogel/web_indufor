import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export { gsap, useGSAP, SplitText }

/** Secuencias atadas al scroll: solo acá. En el resto, imagen fija y revelados simples. */
export const CON_ESCENAS = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
export const CON_MOVIMIENTO = '(prefers-reduced-motion: no-preference)'

/** Lenis movido por el ticker de GSAP, para que ScrollTrigger quede sincronizado. El tacto conserva el scroll nativo. */
export function useScrollSuave() {
  useEffect(() => {
    if (!window.matchMedia(`${CON_ESCENAS} and (pointer: fine)`).matches) return
    const lenis = new Lenis({ lerp: 0.09, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    const paso = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(paso)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(paso)
      lenis.destroy()
    }
  }, [])
}

/**
 * Qué tono usar según lo que haya detrás de la altura `y` (en fracción de pantalla),
 * y qué capítulo está activo. `null` hasta hidratar: sin JavaScript, el índice no se muestra.
 */
export function useLectura(y: number) {
  const [estado, setEstado] = useState<{ sobrePapel: boolean; activo: string } | null>(null)
  useEffect(() => {
    let pendiente = 0
    const medir = () => {
      pendiente = 0
      const linea = window.innerHeight * y
      const sobrePapel = [...document.querySelectorAll('.hoja')].some((h) => {
        const r = h.getBoundingClientRect()
        return r.top <= linea && r.bottom >= linea
      })
      let activo = ''
      for (const s of document.querySelectorAll('[data-capitulo]')) if (s.getBoundingClientRect().top <= window.innerHeight * 0.5) activo = s.id
      setEstado((e) => (e && e.sobrePapel === sobrePapel && e.activo === activo ? e : { sobrePapel, activo }))
    }
    const alMover = () => {
      pendiente ||= requestAnimationFrame(medir)
    }
    medir()
    window.addEventListener('scroll', alMover, { passive: true })
    window.addEventListener('resize', alMover)
    return () => {
      cancelAnimationFrame(pendiente)
      window.removeEventListener('scroll', alMover)
      window.removeEventListener('resize', alMover)
    }
  }, [y])
  return estado
}
