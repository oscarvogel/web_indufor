# Documentación del proyecto

Sitio institucional de Indufor SRL. Las razones de cada elección están en [decisiones.md](decisiones.md).

## Estructura

```text
app/
├── root.tsx               # HTML base, fuentes y scroll suave
├── routes/home.tsx        # La página y sus capítulos
├── components/            # Apertura, Capitulo, Barra, Imagen, Titulo
├── lib/motion.ts          # GSAP, Lenis y medidas para el índice
├── content/sitio.json     # Textos y datos de contacto
├── content/images.json    # Generado por scripts/images.mjs
└── app.css                # Colores, tipografía y escenas
public/
├── img/                   # Generado por scripts/images.mjs
└── servicios|nosotros|contacto/   # Redirecciones de las URL anteriores
scripts/
├── images.mjs             # Imágenes optimizadas, grabados y papel
└── check-build.mjs        # Comprueba el HTML generado
entrega-imagenes-indufor/  # Originales; no se versionan
```

## Editar contenido

Textos, teléfono, correo, dirección y horario están en `app/content/sitio.json`. Después de editar, `npm test` comprueba que sigan en el HTML.

## Cambiar una imagen

1. Reemplazar el PNG en `entrega-imagenes-indufor/`, con el mismo nombre.
2. Ejecutar `npm run images`.

El logo no pasa por este proceso: son los SVG `public/img/logo-indufor.svg` y `public/img/logo-indufor-horizontal.svg`.

## Cómo está armada una escena

La escena oscura usa `position: sticky` y la hoja de papel sube por encima: ese cruce es solo CSS y funciona sin JavaScript. GSAP anima lo que hay dentro, y solo con pantalla de 1024 px o más y sin `prefers-reduced-motion`.
