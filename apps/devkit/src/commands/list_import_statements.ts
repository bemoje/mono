import { getLibsImportStatements } from '../lib/importLibs'

export async function listImportStatementsAction() {
  const arr = await getLibsImportStatements()
  arr.forEach((statement) => {
    console.log(statement)
  })
}
