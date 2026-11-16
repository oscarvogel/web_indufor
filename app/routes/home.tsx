import { useRef, type ReactNode } from 'react'
import Apertura from '../components/Apertura'
import Barra from '../components/Barra'
import Capitulo, { type Objeto } from '../components/Capitulo'
import Imagen from '../components/Imagen'
import Titulo from '../components/Titulo'
import sitio from '../content/sitio.json'
import { CON_MOVIMIENTO, gsap, useGSAP } from '../lib/motion'

const { empresa, apertura, indufor } = sitio
const capitulos = sitio.capitulos as ((typeof sitio.capitulos)[number] & { detalle?: string; objeto: Objeto; acento: Objeto })[]
const NUMEROS = ['II', 'III', 'IV']

// Las columnas dejan libre la franja del índice fijo.
const COLUMNA = 'px-5 lg:pr-16 lg:pl-[17rem]'

export const meta = () => [
  { title: sitio.titulo },
  { name: 'description', content: sitio.descripcion },
  { name: 'robots', content: 'index, follow, max-image-preview:large' },
  { tagName: 'link', rel: 'canonical', href: `${sitio.url}/` },
  { property: 'og:site_name', content: 'Indufor SRL' },
  { property: 'og:locale', content: 'es_AR' },
  { property: 'og:title', content: sitio.titulo },
  { property: 'og:description', content: sitio.descripcion },
  { property: 'og:image', content: `${sitio.url}/og.jpg` },
  { property: 'og:image:type', content: 'image/jpeg' },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:image:alt', content: 'Ilustración al óleo del monte misionero' },
  { property: 'og:url', content: `${sitio.url}/` },
  { property: 'og:type', content: 'website' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: sitio.titulo },
  { name: 'twitter:description', content: sitio.descripcion },
  { name: 'twitter:image', content: `${sitio.url}/og.jpg` },
  { name: 'twitter:image:alt', content: 'Ilustración al óleo del monte misionero' },
  { name: 'geo.region', content: 'AR-N' },
  { name: 'geo.placename', content: 'Garuhapé, Misiones' },
  { name: 'geo.position', content: `${empresa.lat};${empresa.lng}` },
  { name: 'ICBM', content: `${empresa.lat}, ${empresa.lng}` },
  {
    'script:ld+json': {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${sitio.url}/#organizacion`,
      name: 'Indufor SRL',
      legalName: empresa.legalName,
      disambiguatingDescription: 'Empresa argentina de cosecha y transporte forestal con base en Garuhapé, Misiones.',
      description: sitio.descripcion,
      slogan: apertura.descripcion,
      url: `${sitio.url}/`,
      telephone: empresa.telefonoE164,
      email: empresa.email,
      image: `${sitio.url}/og.jpg`,
      logo: `${sitio.url}/img/logo-indufor-512.png`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: empresa.calle,
        addressLocality: empresa.localidad,
        addressRegion: empresa.provincia,
        postalCode: empresa.codigoPostal,
        addressCountry: empresa.pais,
      },
      geo: { '@type': 'GeoCoordinates', latitude: empresa.lat, longitude: empresa.lng },
      hasMap: empresa.mapaUrl,
      sameAs: [empresa.mapaUrl],
      openingHoursSpecification: empresa.horarios.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.dias,
        opens: h.abre,
        closes: h.cierra,
      })),
      areaServed: empresa.areasServidas.map((nombre) => ({ '@type': 'AdministrativeArea', name: nombre })),
      knowsAbout: ['Cosecha forestal', 'Transporte forestal', 'Gestión de residuos forestales', 'Manejo forestal sostenible'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios forestales',
        itemListElement: capitulos.map((c) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: c.subtitulo,
            serviceType: c.titulo,
            description: c.bajada,
            provider: { '@id': `${sitio.url}/#organizacion` },
            areaServed: empresa.areasServidas.map((nombre) => ({ '@type': 'AdministrativeArea', name: nombre })),
          },
        })),
      },
    },
  },
]

export default function Home() {
  const hojas = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(CON_MOVIMIENTO, () => {
        gsap.utils.toArray<HTMLElement>('[data-sin-capitulo] .revelar').forEach((el) => {
          gsap.from(el, { y: 28, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        })
      })
    },
    { scope: hojas },
  )

  return (
    <div ref={hojas}>
      <Barra />
      <main id="contenido">
        <Apertura titulo={apertura.titulo} descripcion={apertura.descripcion} />

        <section id="indufor" data-capitulo data-sin-capitulo className="hoja pt-10 pb-32">
          <div className="borde-rasgado" aria-hidden="true" />
          <div className="borde-rasgado abajo" aria-hidden="true" />
          <div className={`relative ${COLUMNA}`}>
            <p aria-hidden="true" className="font-serif text-xl">I</p>
            <h2 className="titulo-enorme">{indufor.titulo}</h2>
            <div className="mt-16 grid gap-x-16 gap-y-12 xl:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="max-w-3xl">
                <Titulo texto={indufor.subtitulo} className="revelar" />
                <p className="bajada revelar mt-8">{indufor.bajada}</p>
                <div className="lectura mt-8 space-y-5 md:columns-2 md:gap-10 md:space-y-0 [&>p+p]:md:mt-5">
                  {indufor.parrafos.map((p) => (
                    <p key={p} className="revelar break-inside-avoid">{p}</p>
                  ))}
                </div>
              </div>
              <div className="revelar relative mx-auto w-64 xl:w-full">
                <Imagen nombre="araucaria" alt="Ilustración al óleo de una araucaria" sizes="22rem" className="h-auto w-full" />
              </div>
            </div>
            <div className="mt-20 grid gap-x-16 gap-y-10 border-t border-monte/25 pt-10 md:grid-cols-2">
              <div className="revelar">
                <Titulo texto="Nuestra visión" />
                <p className="lectura mt-5">{indufor.vision}</p>
              </div>
              <div className="revelar">
                <Titulo texto="Nuestra misión" />
                <p className="lectura mt-5">{indufor.mision}</p>
              </div>
            </div>
          </div>
        </section>

        {capitulos.map((c, i) => (
          <Capitulo key={c.id} id={c.id} numero={NUMEROS[i]} titulo={c.titulo} fondo={c.fondo} objeto={c.objeto} ultimo={i === capitulos.length - 1}>
            <div className={`relative grid gap-x-16 gap-y-10 pt-14 pb-32 lg:grid-cols-[minmax(0,1fr)_18rem] ${COLUMNA}`}>
              <div className="max-w-3xl">
                <Titulo texto={c.subtitulo} className="revelar" />
                <p className="bajada revelar mt-8">{c.bajada}</p>
                {c.detalle && <p className="lectura revelar mt-6 max-w-xl">{c.detalle}</p>}
                <a href="#contacto" className="enlace revelar mt-8 inline-flex min-h-11 items-center font-semibold">Consultar por este servicio</a>
              </div>
              <div className="acento mx-auto w-56 lg:w-full">
                <Imagen nombre={c.acento.imagen} sizes="18rem" className="h-auto w-full" />
              </div>
            </div>
          </Capitulo>
        ))}

        <section id="contacto" data-capitulo data-sin-capitulo className="hoja pt-10 pb-24">
          <div className={`relative ${COLUMNA}`}>
            <div className="mb-10 border-t border-monte/25" />
            <p aria-hidden="true" className="font-serif text-xl">V</p>
            <h2 className="titulo-enorme">Contacto</h2>
            <div className="mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-2">
              <div>
                <p className="bajada revelar max-w-lg">{sitio.ubicacion}</p>
                <dl className="lectura revelar mt-10 space-y-5">
                  <Dato nombre="Teléfono"><a className="enlace" href={`tel:${empresa.telefono.replace(/[\s-]/g, '')}`}>{empresa.telefono}</a></Dato>
                  <Dato nombre="Correo"><a className="enlace" href={`mailto:${empresa.email}`}>{empresa.email}</a></Dato>
                  <Dato nombre="Dirección">{empresa.direccion}</Dato>
                  <Dato nombre="Horario de atención">{empresa.horario}</Dato>
                </dl>
                <a className="boton revelar mt-10" href={`https://wa.me/${empresa.wsp}`} target="_blank" rel="noopener noreferrer">¡Escríbenos por WhatsApp!</a>
              </div>
              <div className="revelar h-[26rem] overflow-hidden lg:h-[32rem]">
                <iframe title="Ubicación de Indufor SRL en Google Maps" src={empresa.mapa} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
            <div className="mt-16 flex items-end justify-between gap-8">
              <p className="text-sm">© {new Date().getFullYear()} Indufor SRL. Servicios forestales.</p>
              <div className="w-40 lg:w-64"><Imagen nombre="tocon" sizes="16rem" className="h-auto w-full" /></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function Dato({ nombre, children }: { nombre: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-bold">{nombre}</dt>
      <dd>{children}</dd>
    </div>
  )
}
