import { importLibs } from './util/importLibs.mjs'

console.dir(Object.fromEntries((await importLibs()).entries()), { depth: 0 })
