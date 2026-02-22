export * from './TableFormatter'
export * from './formatAsStringTable'
export * from './getHeadersFromCsvFile'
export * from './iterateTableArrayAsObjects'
export * from './objectsToTable'
export * from './parseCsvHeaderLine'

import * as MODULE_1 from './TableFormatter'
import * as MODULE_2 from './formatAsStringTable'
import * as MODULE_3 from './getHeadersFromCsvFile'
import * as MODULE_4 from './iterateTableArrayAsObjects'
import * as MODULE_5 from './objectsToTable'
import * as MODULE_6 from './parseCsvHeaderLine'

export default {
  ...MODULE_1, //
  ...MODULE_2,
  ...MODULE_3,
  ...MODULE_4,
  ...MODULE_5,
  ...MODULE_6,
}
