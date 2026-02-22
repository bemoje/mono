export * from './deleteOlderThan'
export * from './getFileAge'
export * from './getFirstFileInDir'
export * from './readFileFirstLine'
export * from './removeDataUrlSchemePrefix'
export * from './updateFile'
export * from './updateFileLines'
export * from './updateFileLinesSync'
export * from './updateFileSync'
export * from './updateJsonFile'
export * from './updateJsonFileSync'
export * from './walkDirectory'

import * as MODULE_01 from './deleteOlderThan'
import * as MODULE_02 from './getFileAge'
import * as MODULE_03 from './getFirstFileInDir'
import * as MODULE_04 from './readFileFirstLine'
import * as MODULE_05 from './removeDataUrlSchemePrefix'
import * as MODULE_06 from './updateFile'
import * as MODULE_07 from './updateFileLines'
import * as MODULE_08 from './updateFileLinesSync'
import * as MODULE_09 from './updateFileSync'
import * as MODULE_10 from './updateJsonFile'
import * as MODULE_11 from './updateJsonFileSync'
import * as MODULE_12 from './walkDirectory'

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
  ...MODULE_12,
}
