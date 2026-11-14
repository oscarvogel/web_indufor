// Genera todo lo que publica el sitio a partir de entrega-imagenes-indufor/ (no versionada).
// Uso: npm run images. Escribe public/img/* y app/content/images.json (medidas para <Imagen>).
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const raiz = path.resolve(import.meta.dirname, '..')
const entrega = path.join(raiz, 'entrega-imagenes-indufor')
const salida = path.join(raiz, 'public/img')
if (!existsSync(entrega)) {
  console.error(`Falta ${entrega}: son los originales de las imágenes.`)
  process.exit(1)
}
mkdirSync(salida, { recursive: true })

const PERGAMINO = [0xef, 0xe8, 0xd8]
const MONTE = [0x16, 0x30, 0x2b]
const VERDE = '#16302B'

const fuentes = {
  cielo: { archivo: '01_cielo', lineas: true },
  selva: { archivo: '02_selva_media', recorte: true, lineas: true },
  'primer-plano': { archivo: '03_primer_plano', recorte: true, lineas: true },
  tronco: { archivo: '04_tronco', recorte: true, lineas: true },
  cosecha: { archivo: '05_cosecha' },
  transporte: { archivo: '06_transporte' },
  residuos: { archivo: '07_residuos' },
  cosechadora: { archivo: '08_cosechadora', recorte: true },
  camion: { archivo: '09_camion', recorte: true },
  chips: { archivo: '10_chips_ramas', recorte: true },
  araucaria: { archivo: '18_pino', recorte: true },
  casco: { archivo: '21_casco', recorte: true },
  cabezal: { archivo: '25_cabezal', recorte: true },
  tablet: { archivo: '26_tablet_gps', recorte: true },
  tocon: { archivo: '24_tocon', recorte: true },
}

/** Los recortes no tienen ningún píxel opaco y traen ruido casi invisible: al apilar capas se transparentarían. */
const limpiarAlfa = (a) => (a >= 240 ? 255 : a <= 15 ? 0 : Math.round(((a - 15) / 225) * 255))

async function cruda(archivo, recorte) {
  const { data, info } = await sharp(path.join(entrega, `${archivo}.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  if (recorte) for (let i = 3; i < data.length; i += 4) data[i] = limpiarAlfa(data[i])
  return { data, width: info.width, height: info.height }
}

const desdeCruda = ({ data, width, height }) => sharp(data, { raw: { width, height, channels: 4 } })

/** Grabado: bordes de Sobel como líneas color pergamino sobre transparente. */
async function lineas(img, recorte) {
  const { data, width, height } = img
  const gris = await desdeCruda(img).removeAlpha().greyscale().blur(1.1).raw().toBuffer()
  const out = Buffer.alloc(width * height * 4)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = (dx, dy) => gris[(y + dy) * width + x + dx]
      const gx = p(1, -1) + 2 * p(1, 0) + p(1, 1) - p(-1, -1) - 2 * p(-1, 0) - p(-1, 1)
      const gy = p(-1, 1) + 2 * p(0, 1) + p(1, 1) - p(-1, -1) - 2 * p(0, -1) - p(1, -1)
      const fuerza = Math.min(1, Math.max(0, Math.hypot(gx, gy) - 18) / 150) ** 0.8
      const i = (y * width + x) * 4
      // Los recortes llevan verde debajo de las líneas: cada capa tapa a la de atrás, como en la pintura.
      for (let c = 0; c < 3; c++) out[i + c] = recorte ? MONTE[c] + (PERGAMINO[c] - MONTE[c]) * fuerza : PERGAMINO[c]
      out[i + 3] = recorte ? data[i + 3] : Math.round(255 * fuerza)
    }
  }
  return desdeCruda({ data: out, width, height }).png().toBuffer()
}

async function exportar(nombre, crear, width, anchos = width > 1000 ? [960, width] : [width]) {
  for (const w of anchos) {
    await crear().resize({ width: w }).avif({ quality: 58, effort: 5 }).toFile(path.join(salida, `${nombre}-${w}.avif`))
    await crear().resize({ width: w }).webp({ quality: 76, effort: 5 }).toFile(path.join(salida, `${nombre}-${w}.webp`))
  }
  return anchos
}

const manifiesto = {}
for (const [nombre, { archivo, recorte, lineas: conLineas }] of Object.entries(fuentes)) {
  const img = await cruda(archivo, recorte)
  manifiesto[nombre] = { width: img.width, height: img.height, widths: await exportar(nombre, () => desdeCruda(img), img.width) }
  if (conLineas) {
    const buffer = await lineas(img, recorte)
    manifiesto[`${nombre}-lineas`] = { width: img.width, height: img.height, widths: await exportar(`${nombre}-lineas`, () => sharp(buffer), img.width, [img.width]) }
  }
  console.log('listo', nombre)
}
writeFileSync(path.join(raiz, 'app/content/images.json'), `${JSON.stringify(manifiesto, null, 2)}\n`)

// Borde rasgado: papel desplazado con ruido, con un filete de fibra clara por encima.
const ruido = 'type="fractalNoise" baseFrequency="0.0042 0.011" numOctaves="7" seed="23"'
const svgBorde = `<svg xmlns="http://www.w3.org/2000/svg" width="2560" height="260">
  <filter id="r" x="-5%" y="-30%" width="110%" height="160%"><feTurbulence ${ruido}/><feDisplacementMap in="SourceGraphic" scale="210" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="f" x="-5%" y="-30%" width="110%" height="160%"><feTurbulence ${ruido} result="a"/><feDisplacementMap in="SourceGraphic" in2="a" scale="210" xChannelSelector="R" yChannelSelector="G" result="b"/><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="4"/><feDisplacementMap in="b" scale="20" xChannelSelector="G" yChannelSelector="R"/></filter>
  <rect x="-300" y="84" width="3160" height="500" fill="#fbf9f2" filter="url(#f)"/>
  <rect x="-300" y="100" width="3160" height="500" fill="#EFE8D8" filter="url(#r)"/>
  <rect y="178" width="2560" height="82" fill="#EFE8D8"/>
</svg>`
await sharp(Buffer.from(svgBorde)).webp({ quality: 82, alphaQuality: 90 }).toFile(path.join(salida, 'borde-rasgado.webp'))

// Grano de papel en mosaico: ruido del color primario con muy poca opacidad.
const svgPapel = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.75 0.5" numOctaves="3" seed="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.086  0 0 0 0 0.188  0 0 0 0 0.169  0.5 0.5 0 0 -0.47"/></filter><rect width="256" height="256" filter="url(#g)"/></svg>`
await sharp(Buffer.from(svgPapel)).webp({ quality: 35 }).toFile(path.join(salida, 'papel.webp'))

// Imagen para compartir en redes: apertura compuesta.
const capa = async (archivo, w) => desdeCruda(await cruda(archivo, true)).resize({ width: w }).png().toBuffer()
await sharp(path.join(entrega, '01_cielo.png'))
  .resize(1200, 630, { fit: 'cover' })
  .composite([
    { input: await capa('02_selva_media', 1200), top: 230, left: 0 },
    { input: await capa('03_primer_plano', 1200), top: 15, left: 0 },
  ])
  .flatten({ background: VERDE })
  .jpeg({ quality: 80 })
  .toFile(path.join(raiz, 'public/og.jpg'))
console.log('listo')
