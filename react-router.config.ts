import type { Config } from '@react-router/dev/config'

// HTML estático (SEO y sin JavaScript), sin servidor: sirve cualquier hosting.
export default {
  ssr: false,
  prerender: ['/'],
} satisfies Config
