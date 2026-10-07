# Indufor SRL — sitio web

Sitio institucional de Indufor SRL, empresa de Misiones dedicada a servicios de cosecha y transporte forestal. Está construido como un sitio estático con [Eleventy](https://www.11ty.dev/) y plantillas Nunjucks.

## Requisitos

- Node.js 18 o posterior.
- npm, incluido con Node.js.

## Puesta en marcha

```bash
npm install
```

Generar el sitio en `_site/`:

```bash
npx @11ty/eleventy
```

Iniciar el servidor local de desarrollo:

```bash
npx @11ty/eleventy --serve
```

Eleventy informa la dirección local al iniciar el servidor. Los cambios en plantillas y archivos observados se vuelven a generar durante el desarrollo.

## Secciones del sitio

- `/`: portada, presentación, servicios, galería y ubicación.
- `/servicios/`: servicios forestales y de transporte.
- `/nosotros/`: información institucional.
- `/contacto/`: datos de contacto y ubicación.

## Documentación

Consultar [Documentación del proyecto](docs/proyecto.md) para conocer la estructura, el flujo de generación, los datos editables, los recursos estáticos y las consideraciones para publicar el sitio.

## Publicación

El resultado de la compilación es el directorio `_site/`, que puede servirse desde un hosting de sitios estáticos. Este repositorio no incluye por ahora una configuración de despliegue automático.
