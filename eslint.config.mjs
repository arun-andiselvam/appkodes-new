import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * The `lint` script has always been `eslint .`, but nothing was installed for
 * it to run. This is that missing half.
 */
export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  /*
   * cms/** is the Strapi app, added 24 August 2026. It is a separate
   * application with its own package.json, its own lockfile and its own build,
   * and linting a Koa server against next/core-web-vitals produces nothing but
   * noise. The root tsconfig excludes it for the same reason.
   */
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'cms/**']),
])
