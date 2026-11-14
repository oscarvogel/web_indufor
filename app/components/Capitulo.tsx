import { useRef, type ReactNode } from 'react'
import { CON_ESCENAS, CON_MOVIMIENTO, gsap, SplitText, useGSAP } from '../lib/motion'
import Imagen from './Imagen'

export type Objeto = { imagen: string; alt: string }

type Props = {
  id: string
  numero: string
  titulo: string
  fondo: string
  objeto: Objeto
  /** Sin borde inferior: lo que sigue también es papel. */
  ultimo?: boolean
  children: ReactNode
}

/** Escena oscura con título enorme; la hoja de papel la cubre con CSS. GSAP solo anima lo de adentro. */
export default function Capitulo({ id, numero, titulo, fondo, objeto, ultimo = false, children }: Props) {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(CON_MOVIMIENTO, () => {
        const partido = SplitText.create('.titulo-enorme', { type: 'chars', aria: 'none' })
        gsap.from(partido.chars, {
          yPercent: 45,
          opacity: 0,
          stagger: 0.035,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: raiz.current, start: 'top 55%', toggleActions: 'play none none reverse' },
        })
        gsap.utils.toArray<HTMLElement>('.revelar', raiz.current).forEach((el) => {
          gsap.from(el, { y: 28, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        })
        return () => partido.revert()
      })
      mm.add(CON_ESCENAS, () => {
        gsap
          .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: raiz.current, start: 'top bottom', end: 'top -100%', scrub: true } })
          .fromTo('.fondo', { scale: 1.14, yPercent: -3 }, { scale: 1, yPercent: 3 }, 0)
          .fromTo('.objeto', { xPercent: 26, yPercent: 8, rotation: 2 }, { xPercent: -6, yPercent: -3, rotation: -1 }, 0)
        gsap.fromTo('.acento', { yPercent: 25, rotation: -6 }, { yPercent: -25, rotation: 5, ease: 'none', scrollTrigger: { trigger: '.acento', scrub: true } })
      })
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id={id} data-capitulo className="relative">
      <div className="escena tono-claro">
        <div className="fondo absolute inset-0">
          <Imagen nombre={fondo} className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-x-0 top-0 h-2/3 bg-linear-to-b from-monte/85 via-monte/45 to-transparent" />
        <div className="relative px-5 pt-24 lg:pl-[17rem]">
          <p aria-hidden="true" className="font-serif text-xl">{numero}</p>
          <h2 aria-label={titulo} className="titulo-enorme">{titulo}</h2>
        </div>
        <div className="objeto absolute right-[2vw] bottom-[9svh] h-[42svh] w-[92vw] lg:right-[5vw] lg:h-[54svh] lg:w-[60rem]">
          <Imagen nombre={objeto.imagen} alt={objeto.alt} sizes="(min-width: 1024px) 60rem, 92vw" className="h-full w-full object-contain object-right-bottom" />
        </div>
      </div>
      <div className="hoja">
        <div className="borde-rasgado" aria-hidden="true" />
        {children}
        {!ultimo && <div className="borde-rasgado abajo" aria-hidden="true" />}
      </div>
    </section>
  )
}
