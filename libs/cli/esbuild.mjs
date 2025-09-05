import { buildLibsWorkspace } from '../../s/util/buildLibsWorkspace.mjs'

await buildLibsWorkspace(import.meta.dirname, {
  minify: false,
  external: ['commander'],
  format: 'cjs',
})

await buildLibsWorkspace(import.meta.dirname, {
  minify: false,
  external: ['commander'],
  format: 'esm',
})
