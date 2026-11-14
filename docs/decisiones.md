# Decisiones del rediseño

Registro del rediseño del sitio de Indufor SRL. Fecha de inicio: 2026-11-05. Referencia de estilo: [Shopify Editions Winter '26](https://www.shopify.com/editions/winter2026).

**Límite:** de la referencia se toman el lenguaje visual y el ritmo. No se copian imágenes, composiciones, código ni fuentes.

## Resumen

| Tema | Decisión |
|---|---|
| Stack | React 19, React Router con prerender, Vite, Tailwind 4, GSAP, Lenis |
| Estructura | Una sola página con 5 capítulos; las URL viejas redirigen a su ancla |
| Colores | Primario `#16302B`, secundario `#EFE8D8`, acento `#A83E24` |
| Fuentes | Inter Tight, Instrument Serif, Imperial Script (todas OFL-1.1) |
| Imágenes | Óleos generados con IA, de paisaje y objetos. Sin fotos reales |

## Análisis de la referencia

Inspeccionada en Chrome a 1912 px de ancho.

| Aspecto | Hallazgo |
|---|---|
| Scroll | Usa Lenis. No expone `gsap` como global, así que no se sabe qué librería anima. |
| Ritmo | 38.159 px en 12 capítulos. Cada uno abre oscuro con un título enorme, cruza un borde de papel rasgado y sigue en papel claro. |
| Apertura | Collage pintado que, al hacer scroll, pasa a líneas brillantes tipo grabado y estrellas. |
| Navegación | Título e índice fijos a la izquierda, con numerales romanos y capítulo activo. |
| Título de capítulo | NeueMontreal 700, 220 px, interlínea 0,9, tracking −0,03 em. |
| Subtítulo | HWCigars 48 px, interlínea 0,96, tracking −0,05 em, con inicial caligráfica. |
| Bajada | HWCigars 29 px, tracking −0,05 em. |
| Colores | Tinta `#292919`, papeles `#F7F7EE` y `#DCDCD0`. El color fuerte lo aportan las imágenes. |
| Microinteracción | `cubic-bezier(.34,1.56,.64,1)` en 300–500 ms. |

## Stack

- **React Router con prerender, sin servidor.** Genera HTML estático: el contenido llega sin JavaScript y sirve para SEO. Es la misma receta de `web_forestal/fg-site`.
- **GSAP.** La secuencia ligada al scroll es el centro del pedido. La licencia *no charge* permite sitios comerciales; prohíbe usarlo en constructores de animación sin código.
- **Lenis (MIT).** Da la fluidez del scroll y conserva `position: sticky`. ScrollSmoother se descartó porque su contenedor con transform rompe `sticky`.
- **React Bits.** No se usa por ahora: `SplitText` de GSAP cubre lo necesario. Su licencia (MIT + Commons Clause) permite usarlo en sitios de clientes si hiciera falta, sin revender los componentes.
- **Sin WebGL.** El paso de pintura a líneas usa imágenes prerenderizadas y una máscara animada. Evita fallos sin GPU y pesa menos.
- **Skills.** `gsap-*` y `ui-ux-pro-max` ya estaban instaladas en `~/.claude/skills/`.

## Estructura

| Capítulo | Contenido |
|---|---|
| Apertura | Título y descripción de la empresa |
| I Indufor | Quiénes somos, visión y misión |
| II Cosecha | Cosecha sostenible |
| III Transporte | Transporte eficiente |
| IV Residuos | Gestión de residuos |
| V Contacto | Datos, horario y mapa |

- `/servicios/`, `/nosotros/` y `/contacto/` redirigen con HTML estático (`meta refresh` y canonical), porque el hosting no está definido y esto funciona en cualquiera.
- No hay galería: no hay fotos reales de la empresa.

## Colores

Tres colores. Los tonos intermedios se obtienen con la opacidad de estos tres.

| Rol | Valor | Uso |
|---|---|---|
| Primario | `#16302B` verde monte | Texto, fondos oscuros |
| Secundario | `#EFE8D8` pergamino | Fondo de lectura, texto sobre oscuro |
| Acento | `#A83E24` tierra colorada | Enlaces, botones, capítulo activo. Remite a la tierra roja de Misiones |

| Combinación | Contraste | Regla |
|---|---|---|
| Primario sobre pergamino | 11,53:1 | Cualquier texto |
| Acento sobre pergamino | 5,09:1 | Cualquier texto |
| Acento sobre primario | 2,27:1 | Solo decorativo, nunca texto |

El logo se usa en un solo color, porque su verde brillante no convive con esta paleta: `logo-indufor-horizontal.svg` funciona como máscara en la barra. `logo-indufor.svg` conserva los colores originales.

## Fuentes

| Rol | En la referencia (de pago) | Elegida |
|---|---|---|
| Título enorme e interfaz | Neue Montreal + Inter | Inter Tight variable |
| Subtítulo y bajada | HW Cigars | Instrument Serif |
| Inicial caligráfica | Imperial Script | Imperial Script |

- Se autoalojan con `@fontsource`. Licencia OFL-1.1 según npm.
- Instrument Serif es la más parecida a Cigars: angosta, de alto contraste. Reserva: Newsreader 300, si cansa en bajadas largas.
- Descartadas tras probarlas con texto en español: Switzer (licencia sin verificar), General Sans (no cargó), Bodoni Moda (se rompe a tamaño chico), Cormorant y Fraunces (menos parecidas).
- HW Cigars y Neue Montreal requieren licencia comercial.
- La inicial caligráfica se usa solo en títulos cortos.

## Imágenes

**Decisión de Roman:** se publica con la entrega de `entrega-imagenes-indufor/`, generada con IA, sin fotos reales. Ningún texto la presenta como fotos de obra o de la flota de Indufor.

| Lugar | Fondo | Objetos |
|---|---|---|
| Apertura | `01_cielo`, `02_selva_media`, `03_primer_plano` | `04_tronco` |
| I Indufor | Pergamino | `18_pino` |
| II Cosecha | `05_cosecha` | `08_cosechadora`, `25_cabezal` |
| III Transporte | `06_transporte` | `09_camion`, `26_tablet_gps` |
| IV Residuos | `07_residuos` | `10_chips_ramas`, `21_casco` |
| V Contacto | Pergamino | `24_tocon` |

`scripts/images.mjs` genera lo que publica el sitio: AVIF y WebP, versiones en líneas, borde rasgado, textura de papel. Los originales no se versionan (`.gitignore`), así que conviene guardar un respaldo aparte.

### Temas abiertos

- **Resolución.** Los fondos miden 1672–1774 px, no los 3840 pedidos. No se agrandan artificialmente. La apertura se ve nítida a 2560 px; los fondos de capítulo no se revisaron en detalle a ese tamaño.

`05_cosecha` se regeneró el 2026-11-05: la primera versión mostraba personas y bueyes, contra lo acordado.

El 2026-11-14, a pedido del cliente, los acentos de capítulo pasaron de herramientas manuales (motosierra, cinta métrica, hacha) a equipos modernos: cabezal procesador, tablet con GPS y casco forestal. `19_hacha`, `20_motosierra`, `22_compas` y `23_cinta_metrica` quedan en la entrega sin usar.

Prompts usados para las piezas nuevas, que sirven de base si hace falta otra en el mismo estilo:
- `25_cabezal`: «Oil painting illustration of a modern forestry harvester head (processing head with feed rollers, delimbing knives and saw bar), isolated object, three-quarter view, yellow and black industrial paint with light wear and wood resin, visible thick brushstrokes, warm natural light from the upper left, soft painterly shading, no machine body, no people, no text, no logos, transparent background, PNG cutout.»
- `26_tablet_gps`: «Oil painting illustration of a modern rugged field tablet with rubber corner bumpers, its screen showing a satellite map with a highlighted truck route through forest plantations and a GPS location pin, isolated object, three-quarter view, dark grey and safety-orange casing, visible thick brushstrokes, warm natural light from the upper left, soft painterly shading, no hands, no people, no readable text, no logos, transparent background, PNG cutout.»

### Material anterior descartado

- `videos/hero.mp4`: **tiene marca de agua de Artlist.** Se usa sin licencia o es una vista previa. No debe publicarse.
- `servicios/*`, `galeria/*`, `forest-*`, `cosecha_madera`, `vision_mision`: casi todas de 656 px, con bosques de otra región o motivos ajenos, como un mini volquete de marca o una persona cargando paja. Parecen de banco; no se pudo confirmar su origen.

## Movimiento

- **Apertura:** escena fija con `position: sticky`. Las capas se mueven a distinta velocidad, y la pintura pasa a líneas de grabado.
- **Capítulos:** el fondo queda fijo con `sticky` y el papel rasgado sube por encima. Ese cruce es CSS puro; GSAP solo anima lo que hay dentro.
- **Lectura:** revelados cortos, sin atar al scroll.

**Reglas:**
- Se anima solo `transform` y `opacity`, salvo la máscara de la apertura.
- En celular no hay capas ni secuencia larga.
- Con `prefers-reduced-motion` no hay Lenis ni secuencias.
- Sin JavaScript todo el contenido se lee.
- Los fundidos usan `opacity`, no `visibility`: el contenido sigue disponible para lectores de pantalla y teclado.

## Contraste sobre imágenes

Axe no evalúa texto sobre imágenes, así que se midió sobre píxeles con el texto oculto, a 2560, 1440 y 390 px.

- El título de la apertura daba 1,35:1 en el peor píxel, sobre nubes claras. Con el velo oscuro detrás del texto, el peor píxel es 4,29:1.
- La bajada de la apertura queda en 5,68:1 o más.
- Los títulos de capítulo dan alrededor de 13:1. Mientras el borde de papel pasa por encima, el contraste cae un instante.
- El índice sobre pintura lleva un velo del 82 %, calculado, no medido sobre píxeles.

## Correcciones de contenido

El 2026-11-14, a pedido del cliente, el texto se reescribió con la skill `humanizer` para quitarle el tono de folleto. Se conservó lo que dice y no se agregaron datos. Cambios a propósito:
- «Somos líderes» se quitó de la descripción, y en «Quiénes somos» quedó como aspiración.
- «Misiones» y «Ruta Nacional 12» se tomaron de la dirección y se usan en la descripción y en la ubicación.
- Los títulos, los subtítulos y los datos de contacto no cambiaron.

Antes de esa reescritura se mantenía el texto del sitio anterior, con estos cambios:

- Pie: decía «© 2025 Servin LGSM»; ahora dice Indufor SRL.
- Erratas: «Nuetra Mision», «Nuestra Vision».
- Se quitaron los enlaces de privacidad y términos, que apuntaban a `#`.
- Eleventy y su contenido anterior se eliminaron del repositorio; siguen en el historial de git.
- Títulos de capítulo («Cosecha», «Transporte», «Residuos») derivados de los nombres de cada servicio.
