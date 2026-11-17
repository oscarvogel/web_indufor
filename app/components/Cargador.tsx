import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'

/**
 * Va en <head>: el cargador solo se muestra con la clase `cargando`, así que sin JavaScript no existe.
 * Si el JavaScript tarda o falla, la quita igual a los 6 s.
 */
export const ACTIVAR_CARGADOR =
  "document.documentElement.classList.add('cargando');setTimeout(function(){document.documentElement.classList.remove('cargando')},6000)"

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Logo que se rellena mientras se prepara la pantalla de llegada: la apertura, el capítulo del enlace
 * o la posición que restaura el navegador. Espera solo las imágenes visibles ahí, no las de toda la página.
 */
export default function Cargador() {
  const relleno = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const html = document.documentElement
    // motion.ts pausó GSAP si el cargador estaba activo: las entradas corren cuando se abre, no tapadas.
    if (!html.classList.contains('cargando')) return void gsap.globalTimeline.resume()
    let cancelado = false

    const preparar = async () => {
      const enVista = [...document.images].filter((img) => {
        const r = img.getBoundingClientRect()
        return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && (img.checkVisibility?.({ visibilityProperty: true }) ?? true)
      })
      const recursos = Promise.all([document.fonts.ready, ...enVista.map((img) => img.decode().catch(() => {}))])
      // Con movimiento reducido no hay relleno: el logo queda quieto un instante para no parpadear.
      const animacion = relleno.current?.getAnimations()[0]?.finished ?? esperar(500)
      await Promise.all([animacion, Promise.race([recursos, esperar(3000)])])
    }

    preparar()
      .catch(() => {})
      .then(() => {
        if (cancelado) return
        html.classList.add('abriendo')
        gsap.globalTimeline.resume()
        setTimeout(() => html.classList.remove('cargando', 'abriendo'), 700)
      })
    return () => {
      cancelado = true
    }
  }, [])

  return (
    <div className="cargador" aria-hidden="true">
      <div className="cargador-logo">
        <span ref={relleno} />
      </div>
    </div>
  )
}
