export * from './decrypt'
export * from './encrypt'

import * as MODULE_1 from './decrypt'
import * as MODULE_2 from './encrypt'

export default {
  ...MODULE_1, //
  ...MODULE_2,
}
