/**
 * Lists all available modules and their exports from the libs directory.
 * Useful for inspecting what functions and classes are available in the monorepo libraries.
 */
import { inspect } from 'util'
import { importLibs } from '../util/importLibs.mjs'

console.log('Listing all built modules in libs directory...')

const libs = Object.fromEntries((await importLibs()).entries())

console.log(inspect(libs, { colors: false, depth: 1 }).replace(/\[Module: null prototype\] /g, ''))
