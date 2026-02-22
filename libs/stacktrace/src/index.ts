export * from './enablePrettyStackTrace'
export * from './prettyStackTrace'

import * as MODULE_1 from './enablePrettyStackTrace'
import * as MODULE_2 from './prettyStackTrace'

export default {
  ...MODULE_1, //
  ...MODULE_2,
}
