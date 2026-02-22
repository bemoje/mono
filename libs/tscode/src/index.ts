export * from './importStatementGetKeywords'
export * from './importStatementHasTypeKeyword'
export * from './importStatementStripKeywords'
export * from './importStatementToFormattedOneLiner'
export * from './importStatementToOneLiner'
export * from './parseImportStatement'
export * from './tsCrlfToLf'
export * from './tsExtractImports'
export * from './tsLintFilepath'
export * from './tsSortImports'
export * from './tsStripImports'

import * as MODULE_01 from './importStatementGetKeywords'
import * as MODULE_02 from './importStatementHasTypeKeyword'
import * as MODULE_03 from './importStatementStripKeywords'
import * as MODULE_04 from './importStatementToFormattedOneLiner'
import * as MODULE_05 from './importStatementToOneLiner'
import * as MODULE_06 from './parseImportStatement'
import * as MODULE_07 from './tsCrlfToLf'
import * as MODULE_08 from './tsExtractImports'
import * as MODULE_09 from './tsLintFilepath'
import * as MODULE_10 from './tsSortImports'
import * as MODULE_11 from './tsStripImports'

export default {
  ...MODULE_01, //
  ...MODULE_02,
  ...MODULE_03,
  ...MODULE_04,
  ...MODULE_05,
  ...MODULE_06,
  ...MODULE_07,
  ...MODULE_08,
  ...MODULE_09,
  ...MODULE_10,
  ...MODULE_11,
}
