/**
 * Lists all import statements found in the libs directory source files.
 * Useful for analyzing dependencies and import patterns across the monorepo.
 */
import { getLibsImportStatements } from '../util/getLibsImportStatements.mjs'

const arr = await getLibsImportStatements()
arr.forEach((statement) => {
  console.log(statement)
})
