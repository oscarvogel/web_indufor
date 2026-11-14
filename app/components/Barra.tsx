import sitio from '../content/sitio.json'
import { useLectura } from '../lib/motion'

export const INDICE = [
  { id: 'indufor', nombre: 'Indufor', numero: 'I' },
  { id: 'cosecha', nombre: 'Cosecha', numero: 'II' },
  { id: 'transporte', nombre: 'Transporte', numero: 'III' },
  { id: 'residuos', nombre: 'Residuos', numero: 'IV' },
  { id: 'contacto', nombre: 'Contacto', numero: 'V' },
]

/** Marca arriba e índice romano a la izquierda (solo escritorio); ambos cambian de tono con lo que tengan detrás. */
export default function Barra() {
  const arriba = useLectura(0.05)
  const abajo = useLectura(0.75)
  return (
    <>
      <a href="#contenido" className="boton fixed top-3 left-3 z-40 -translate-y-24 focus:translate-y-0">Saltar al contenido</a>
      <header className={`barra fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-3 lg:px-10 ${arriba?.sobrePapel ? 'tono-oscuro' : 'tono-claro'}`}>
        <a href="#inicio" aria-label="Indufor SRL, volver al inicio" className="logo h-12 w-36 lg:h-14 lg:w-40" />
        <a href="#contacto" className="flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline">Contacto</a>
        <a className="boton fixed right-4 bottom-4 z-30 shadow-lg lg:right-8 lg:bottom-8" href={`https://wa.me/${sitio.empresa.wsp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </header>
      {abajo && (
        <nav aria-label="Capítulos" className={`indice fixed bottom-6 left-7 z-30 hidden w-48 p-3 lg:block ${abajo.sobrePapel ? 'tono-oscuro' : 'tono-claro'}`}>
          <ol>
            {INDICE.map(({ id, nombre, numero }) => {
              const activo = abajo.activo === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={activo ? 'true' : undefined}
                    className={`flex items-baseline gap-2 py-0.5 text-[1.0625rem] leading-tight font-bold tracking-tight transition-opacity duration-300 hover:opacity-100 ${activo ? 'opacity-100' : 'opacity-80'}`}
                  >
                    {nombre}
                    <span aria-hidden="true" className={`mb-1 flex-1 border-b border-dotted border-current ${activo ? 'opacity-100' : 'opacity-0'}`} />
                    <span aria-hidden="true" className="font-serif text-xs font-normal">{numero}</span>
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>
      )}
    </>
  )
}
