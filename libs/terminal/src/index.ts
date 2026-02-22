export * from './clearTerminal'
export * from './confirmPrompt'

import * as MODULE_1 from './clearTerminal'
import * as MODULE_2 from './confirmPrompt'

export default {
  ...MODULE_1, //
  ...MODULE_2,
}
