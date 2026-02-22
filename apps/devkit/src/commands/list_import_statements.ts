import { Command } from 'commander'
import { getLibsImportStatements } from '../lib/importLibs'

export function list_import_statements() {
  return new Command('list-import-statements')
    .alias('lis')
    .description('List all import statements found in libs source files.')
    .action(async () => {
      const arr = await getLibsImportStatements()
      arr.forEach((statement) => {
        console.log(statement)
      })
    })
}
