# Documentación del proyecto

## Propósito

Este repositorio contiene el sitio institucional de Indufor SRL. Presenta la empresa, sus servicios forestales, información de contacto y material visual relacionado con sus operaciones en Misiones, Argentina.

## Tecnologías

- **Eleventy 3** genera el sitio estático a partir del contenido de `src/`.
- **Nunjucks** proporciona las plantillas `.njk`, los layouts y los componentes reutilizables.
- **JSON** en `src/_data/` contiene datos compartidos por las plantillas.
- **CSS** propio está en `src/assets/css/style.css`.
- El layout carga Tailwind CSS, Swiper, AOS, Font Awesome y Toastr desde CDN. Se necesita conexión a Internet para esos recursos externos.
- La salida compilada se escribe en `_site/`.

El proyecto incluye configuraciones de Tailwind y PostCSS, pero el `package.json` no define actualmente un paso de compilación de CSS. La generación documentada aquí es la de Eleventy.

## Estructura

```text
.
├── .eleventy.js                 # Configuración de Eleventy
├── package.json                 # Dependencias npm
├── package-lock.json            # Versiones instaladas
├── tailwind.config.js           # Configuración de Tailwind
├── postcss.config.js            # Configuración de PostCSS
├── src/
│   ├── index.njk                # Portada
│   ├── contacto/index.njk       # Contacto
│   ├── nosotros/index.njk       # Información institucional
│   ├── servicios/index.njk      # Servicios
│   ├── _data/                   # Datos globales en JSON
│   ├── _includes/
│   │   ├── layouts/             # Estructura HTML compartida
│   │   └── partials/            # Secciones reutilizables
│   └── assets/                  # CSS, imágenes y video
├── docs/
│   └── proyecto.md              # Esta documentación
└── _site/                       # Salida generada; no se versiona
```

Eleventy toma `src/` como entrada y `_site/` como salida. La configuración copia `src/assets/` sin procesar a `_site/assets/`, usa `src/_includes/` para includes y `src/_data/` para datos globales.

## Páginas y componentes

Las páginas se definen con una plantilla `index.njk` en cada directorio. Los archivos de `src/_includes/layouts/` envuelven el contenido de las páginas; los archivos de `src/_includes/partials/` agrupan elementos como encabezado, pie, hero, servicios, galería, ubicación y botón de WhatsApp.

La portada incluye el hero, visión y misión, servicios, galería y ubicación. Las páginas de servicios y contacto también reutilizan componentes del sitio. El diseño base define el idioma español, las referencias a recursos externos y las etiquetas meta.

## Edición de contenido

Los archivos de `src/_data/` se cargan como datos globales de Nunjucks. Para actualizar contenido existente:

| Archivo | Contenido |
| --- | --- |
| `datos_empresa.json` | Teléfono, WhatsApp, correo, dirección, logo y eslogan. |
| `navigation.json` | Elementos y enlaces del menú. |
| `hero.json` | Título, descripción, video y llamada a la acción del hero. |
| `servicios_forestales.json` | Título, introducción e información de servicios. |
| `vision_mision.json` | Texto de presentación, visión, misión e imagen. |
| `galeria.json` | Datos de galería disponibles; la plantilla actual define las cuatro imágenes directamente en `src/_includes/partials/galeria.njk`. |

Al agregar imágenes o videos, guardarlos en `src/assets/` y actualizar la ruta que use la plantilla correspondiente. Las rutas utilizadas por las páginas comienzan en `/assets/`, que corresponde al directorio copiado a la salida.

Para agregar una página, crear un directorio bajo `src/` con un `index.njk`, definir sus metadatos al inicio del archivo y asociarla al layout compartido. Si debe aparecer en el menú, agregar su título y ruta en `src/_data/navigation.json`.

## Desarrollo y compilación

Instalar dependencias una vez:

```bash
npm install
```

Generar el sitio:

```bash
npx @11ty/eleventy
```

Servirlo localmente durante el desarrollo:

```bash
npx @11ty/eleventy --serve
```

La carpeta `_site/` se puede borrar y regenerar ejecutando la compilación. No editar allí: los cambios deben hacerse en `src/`.

## Publicación

Publicar el contenido de `_site/` en un servidor o servicio compatible con hosting estático. No hay actualmente workflow de GitHub Actions ni configuración de hosting en este repositorio; la publicación debe configurarse por separado si se desea automatizarla.
