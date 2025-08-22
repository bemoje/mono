import { buildLibsWorkspace } from '../../s/util/buildLibsWorkspace.mjs'

await buildLibsWorkspace(import.meta.dirname, { debug: false })
