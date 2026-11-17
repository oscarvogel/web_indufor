import type { ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts } from 'react-router'
import './app.css'
import interTight from '@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2?url'
import instrumentSerif from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url'
import imperialScript from '@fontsource/imperial-script/files/imperial-script-latin-400-normal.woff2?url'
import { useScrollSuave } from './lib/motion'
import Cargador, { ACTIVAR_CARGADOR } from './components/Cargador'

// Las tres están en la primera pantalla o en el primer capítulo: precargarlas evita saltos.
export const links = () =>
  [interTight, instrumentSerif, imperialScript].map((href) => ({ rel: 'preload', as: 'font', type: 'font/woff2', href, crossOrigin: 'anonymous' as const }))

export function Layout({ children }: { children: ReactNode }) {
  return (
    // El script de <head> agrega `cargando` antes de hidratar.
    <html lang="es-AR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: ACTIVAR_CARGADOR }} />
        <meta name="theme-color" content="#16302B" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <Meta />
        <Links />
      </head>
      <body>
        <Cargador />
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  useScrollSuave()
  return <Outlet />
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const noExiste = isRouteErrorResponse(error) && error.status === 404
  return (
    <main className="tono-claro flex min-h-svh flex-col justify-center gap-8 bg-monte px-6 lg:px-16">
      <title>{noExiste ? 'Página no encontrada | Indufor SRL' : 'Error | Indufor SRL'}</title>
      <meta name="robots" content="noindex" />
      <h1 className="subtitulo max-w-3xl">{noExiste ? 'Este camino no lleva al monte.' : 'Algo salió mal.'}</h1>
      <a className="boton self-start" href="/">Volver al inicio</a>
    </main>
  )
}
