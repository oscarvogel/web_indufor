import { useRef, type CSSProperties } from 'react'
import { CON_ESCENAS, gsap, useGSAP } from '../lib/motion'
import Imagen from './Imagen'

// Cada capa existe dos veces, en pintura y en líneas, y ambas reciben el mismo movimiento: siempre coinciden.
const CAPAS = [
  { clase: 'capa-cielo', nombre: 'cielo', img: 'inset-0 h-full w-full object-cover' },
  { clase: 'capa-selva', nombre: 'selva', img: 'bottom-[7%] left-1/2 w-[260vw] -translate-x-1/2 lg:bottom-[-6%] lg:w-[108%]' },
  { clase: 'capa-frente', nombre: 'primer-plano', img: 'inset-0 h-full w-full object-cover' },
  { clase: 'capa-tronco', nombre: 'tronco', img: 'bottom-[8%] left-1/2 w-[92vw] -translate-x-1/2 lg:bottom-[-7%] lg:w-[min(62vw,56rem)]' },
]

const DESTELLOS = [
  [14, 22, 90], [27, 12, 46], [38, 30, 130], [52, 16, 60], [63, 28, 104],
  [74, 11, 48], [86, 26, 82], [21, 44, 58], [80, 42, 64], [47, 38, 40],
].map(([x, y, t]) => ({ left: `${x}%`, top: `${y}%`, '--t': `${t}px` }) as CSSProperties)

export default function Apertura({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  const raiz = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(CON_ESCENAS, () => {
        const linea = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: raiz.current, start: 'top top', end: 'bottom bottom', scrub: true },
        })
        // Acercamiento: cada capa avanza distinto, como una cámara entrando al monte.
        linea
          .to('.capa-cielo', { scale: 1.08, duration: 1 }, 0)
          .to('.capa-selva', { scale: 1.16, yPercent: -3, duration: 1 }, 0)
          .to('.capa-frente', { scale: 1.5, duration: 1 }, 0)
          .to('.capa-tronco', { scale: 1.22, yPercent: 8, duration: 1 }, 0)
          .to('.apertura-texto', { opacity: 0, y: -60, duration: 0.2 }, 0.04)
          // La pintura se abre desde el centro y deja ver el grabado.
          .set('.grabado', { visibility: 'visible' }, 0.3)
          .fromTo(['.pintura', '.grabado'], { '--radio': '-18%' }, { '--radio': '110%', duration: 0.5 }, 0.3)
          .from('.destello', { scale: 0, opacity: 0, stagger: 0.02, duration: 0.14 }, 0.52)
      })
    },
    { scope: raiz },
  )

  return (
    <div ref={raiz} id="inicio">
      <div className="escena">
        <div className="pintura">
          {CAPAS.map(({ clase, nombre, img }, i) => (
            <div key={nombre} className={`capa ${clase}`}>
              <Imagen nombre={nombre} className={img} prioridad={i < 2} sizes={nombre === 'tronco' ? '(min-width: 1024px) 60vw, 92vw' : nombre === 'selva' ? '(min-width: 1024px) 108vw, 120vw' : '100vw'} />
            </div>
          ))}
        </div>
        <div className="grabado hidden lg:block" aria-hidden="true">
          {CAPAS.map(({ clase, nombre, img }) => (
            <div key={nombre} className={`capa ${clase}`}>
              <Imagen nombre={`${nombre}-lineas`} className={img} />
            </div>
          ))}
          {DESTELLOS.map((estilo, i) => (
            <span key={i} className="destello" style={estilo} />
          ))}
        </div>
        <div className="apertura-texto tono-claro absolute inset-x-0 top-[13svh] z-10 mx-auto max-w-5xl px-5 py-8 text-center">
          <h1 className="text-[clamp(2.75rem,7.2vw,7rem)] leading-[0.92] font-bold tracking-[-0.03em] text-balance">{titulo}</h1>
          <p className="bajada mx-auto mt-5 max-w-xl">{descripcion}</p>
        </div>
      </div>
      <div className="recorrido" aria-hidden="true" />
    </div>
  )
}
