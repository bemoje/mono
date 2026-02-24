export * from './lib/Command'
export * from './lib/Help'
export * from './lib/helpers/findCommand'
export * from './lib/helpers/findOption'
export * from './lib/helpers/getCommandAncestors'
export * from './lib/helpers/getCommandAndAncestors'
export * from './lib/helpers/parseOptionFlags'
export * from './lib/types'

import * as MODULE_1 from './lib/Command'
import * as MODULE_2 from './lib/Help'
import * as MODULE_3 from './lib/helpers/findCommand'
import * as MODULE_4 from './lib/helpers/findOption'
import * as MODULE_5 from './lib/helpers/getCommandAncestors'
import * as MODULE_6 from './lib/helpers/getCommandAndAncestors'
import * as MODULE_7 from './lib/helpers/parseOptionFlags'
import * as MODULE_8 from './lib/types'

export default {
  ...MODULE_1, //
  ...MODULE_2,
  ...MODULE_3,
  ...MODULE_4,
  ...MODULE_5,
  ...MODULE_6,
  ...MODULE_7,
  ...MODULE_8,
}
