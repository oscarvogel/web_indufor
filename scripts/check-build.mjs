// Después de `react-router build`: el HTML generado debe traer contenido, datos de contacto y SEO sin JavaScript,
// las URL viejas deben redirigir, y no debe publicarse nada del sitio anterior (el video tiene marca de agua).
import { existsSync, readFileSync, readdirSync } from 'node:fs'

const salida = new URL('../build/client/', import.meta.url)
if (!existsSync(new URL('index.html', salida))) {
  console.error('Falta build/client/index.html: ejecutar `npm run build` primero.')
  process.exit(1)
}
const leer = (ruta) => readFileSync(new URL(ruta, salida), 'utf8')
const sitio = JSON.parse(readFileSync(new URL('../app/content/sitio.json', import.meta.url), 'utf8'))
const html = leer('index.html')
const fallas = []
const exigir = (condicion, mensaje) => condicion || fallas.push(mensaje)

const textos = [
  sitio.apertura.titulo,
  sitio.indufor.vision,
  sitio.indufor.mision,
  sitio.empresa.telefono,
  sitio.empresa.email,
  sitio.empresa.direccion,
  ...sitio.capitulos.flatMap((c) => [c.titulo, c.subtitulo, c.bajada]),
]
for (const t of textos) exigir(html.includes(t), `Falta en el HTML: "${t.slice(0, 50)}"`)
exigir(html.includes(`rel="canonical" href="${sitio.url}/"`), 'Falta el canonical')
exigir(html.includes('"LocalBusiness"'), 'Falta el JSON-LD')
exigir((html.match(/<h1/g) ?? []).length === 1, 'Debe haber un solo h1')
exigir(!/Servin/i.test(html), 'Sigue el nombre de otra empresa en el pie')

for (const [ruta, ancla] of [['servicios', 'cosecha'], ['nosotros', 'indufor'], ['contacto', 'contacto']]) {
  exigir(html.includes(`id="${ancla}"`), `Falta el ancla #${ancla}`)
  exigir(leer(`${ruta}/index.html`).includes(`url=/#${ancla}`), `/${ruta}/ no redirige a #${ancla}`)
}

// Un solo dominio: si sitemap, robots o redirecciones apuntan a otro, Google recibe señales cruzadas.
for (const ruta of ['sitemap.xml', 'robots.txt', 'servicios/index.html', 'nosotros/index.html', 'contacto/index.html']) {
  const dominios = leer(ruta).match(/https?:\/\/[^/"<\s]+/g)?.filter((d) => !/sitemaps\.org/.test(d)) ?? []
  exigir(dominios.length && dominios.every((d) => d === sitio.url), `${ruta} no usa solo ${sitio.url}: ${dominios.join(', ')}`)
}

// Sin JavaScript el cargador no debe tapar nada: la clase la pone el script y tiene un tope propio.
exigir(!/<html[^>]*cargando/.test(html), 'El HTML sale con el cargador activo')
exigir(/classList\.remove\('cargando'\)\},\d+\)/.test(html), 'Falta el tope del cargador en <head>')

const archivos = readdirSync(salida, { recursive: true }).map(String)
exigir(!archivos.some((a) => a.endsWith('.mp4')), 'Se publicó un video: el anterior tiene marca de agua')
exigir(archivos.some((a) => a.endsWith('logo-indufor-horizontal.svg')), 'Falta el logo vectorial')

if (fallas.length) {
  console.error(fallas.join('\n'))
  process.exit(1)
}
console.log(`check-build: ${textos.length} textos, redirecciones y SEO correctos.`)
