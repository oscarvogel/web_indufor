# SEO y presencia local

Actualizado: 2026-11-16.

## Dominio y URLs

- Dominio canónico: `https://indufor.com.ar`.
- `http://indufor.com.ar` y `https://www.indufor.com.ar` redirigen con 301 al dominio canónico.
- URLs viejas con 301:
  - `/servicios/` → `/#cosecha`
  - `/nosotros/` → `/#indufor`
  - `/contacto/` → `/#contacto`
- `/__spa-fallback.html` queda fuera de `robots.txt` y con `X-Robots-Tag: noindex, nofollow`.
- Sitemap: `https://indufor.com.ar/sitemap.xml`.
- Canonical, Open Graph, Twitter Cards y JSON-LD usan `https://indufor.com.ar`.

## Datos de la empresa

La fuente de verdad es el sitio, y el Google Business Profile debe coincidir:

- Nombre: Indufor SRL (`Indufor S.R.L.` como razón social).
- Teléfono: `+54 9 3743 48-3443` (`+5493743483443` en schema).
- WhatsApp: `543743483443`.
- Email: `indufor@prico.com.ar`.
- Dirección: Ruta Nacional 12 Km 1478, Garuhapé, Misiones (N3334), Argentina.
- Coordenadas: `-26.8216019, -54.9682578`.
- Horario: lunes a viernes 7:30–12:00 y 14:30–18:00; sábados 7:30–12:00; domingos cerrado.
- Área servida: Misiones y Corrientes.

El horario, la dirección y las coordenadas se toman de Google Maps. Si cambia alguno, actualizar `app/content/sitio.json` y el Google Business Profile el mismo día.

## Google Business Profile

Tareas pendientes del lado de la cuenta:

1. Corregir la dirección a `Ruta Nacional 12 Km 1478, Garuhapé, Misiones, N3334`.
2. Corregir el horario a lunes a viernes 7:30–12:00 y 14:30–18:00; sábados 7:30–12:00; domingos cerrado.
3. Revisar el teléfono y usar el mismo formato que el sitio.
4. Categoría principal: Forestry service.
5. Completar servicios: cosecha forestal, transporte forestal y gestión de residuos.
6. Subir fotos reales del equipo, equipos y trabajos.
7. Pedir reseñas a clientes reales y responder todas.
8. Publicar novedades y trabajos al menos una vez por mes.
9. Revisar preguntas y respuestas del perfil.

No agregar reseñas ni calificaciones inventadas al schema del sitio. `aggregateRating` solo si hay reseñas reales y visibles.

## Search Console y Bing

Las propiedades todavía no están verificadas. Pasos:

1. Google Search Console: agregar `indufor.com.ar` como propiedad de dominio (DNS) o prefijo de URL.
2. Verificar con el registro TXT de DNS o con el archivo HTML.
3. Enviar `https://indufor.com.ar/sitemap.xml`.
4. Usar Inspección de URL para pedir indexación de `https://indufor.com.ar/`.
5. Revisar el informe de rendimiento de IA generativa de Search Console.
6. Bing Webmaster Tools: agregar el sitio, verificar y enviar el sitemap.
7. Opcional: IndexNow para avisar cambios a Bing.

Mientras no estén verificadas, no hay meta de verificación en el sitio.

## Crawlers de IA

La política actual permite búsqueda y entrenamiento: `User-agent: *` con `Allow: /`.

Si en el futuro se quiere bloquear entrenamiento sin perder búsqueda:

- Permitir: `Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`.
- Decidir aparte: `GPTBot`, `ClaudeBot`, `Google-Extended`.

Recordar que `robots.txt` es una preferencia; un firewall o CDN puede bloquear igual.

## Qué se implementó en el sitio

- `LocalBusiness` con `@id`, `legalName`, `disambiguatingDescription`, `image`, `logo`, `geo`, `hasMap`, `sameAs`, `openingHoursSpecification`, `areaServed`, `knowsAbout` y `hasOfferCatalog` con los tres servicios.
- Open Graph y Twitter Cards completos, `og:locale`, `og:site_name`, dimensiones y alt de la imagen.
- `robots` con `max-image-preview:large`.
- Metadatos geográficos legacy (`geo.region`, `geo.placename`, `geo.position`, `ICBM`).
- Logo cuadrado de 512 px y apple-touch-icon de 180 px.

## Medición y siguientes pasos

- Revisar mensualmente Search Console: consultas, impresiones, páginas indexadas y rendimiento de IA generativa.
- Revisar el GBP: llamadas, solicitudes de indicaciones, mensajes, reseñas y fotos.
- Probar manualmente preguntas reales en Google, ChatGPT, Perplexity y Copilot; registrar si Indufor aparece y con qué datos.
- P2: agregar preguntas frecuentes visibles con datos reales (sin `FAQPage` para rich results, retirado el 7/5/2026), sumar `llms.txt` solo si se decide, y ampliar contenido por servicio si se quieren posicionar consultas específicas.
