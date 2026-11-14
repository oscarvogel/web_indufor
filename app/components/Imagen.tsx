import imagenes from '../content/images.json'

const manifiesto = imagenes as Record<string, { width: number; height: number; widths: number[] }>

type Props = {
  nombre: string
  alt?: string
  sizes?: string
  className?: string
  prioridad?: boolean
}

/** Variantes AVIF/WebP de scripts/images.mjs; width y height evitan saltos de maquetado. */
export default function Imagen({ nombre, alt = '', sizes = '100vw', className, prioridad = false }: Props) {
  const img = manifiesto[nombre]
  if (!img) throw new Error(`Imagen sin variantes: ${nombre}. Agregarla en scripts/images.mjs`)
  const set = (formato: string) => img.widths.map((w) => `/img/${nombre}-${w}.${formato} ${w}w`).join(', ')
  return (
    <picture style={{ display: 'contents' }}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <img
        src={`/img/${nombre}-${img.widths.at(-1)}.webp`}
        srcSet={set('webp')}
        sizes={sizes}
        alt={alt}
        width={img.width}
        height={img.height}
        loading={prioridad ? 'eager' : 'lazy'}
        fetchPriority={prioridad ? 'high' : undefined}
        decoding={prioridad ? 'sync' : 'async'}
        className={className}
      />
    </picture>
  )
}
