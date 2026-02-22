export * from './core/ConfigFile'
export * from './interfaces/ConfigDataStrategy'
export * from './interfaces/ConfigValidationStrategy'
export * from './strategies/JsonFileStrategy'
export * from './strategies/SchemaConfigStrategy'

import * as MODULE_1 from './core/ConfigFile'
import * as MODULE_2 from './interfaces/ConfigDataStrategy'
import * as MODULE_3 from './interfaces/ConfigValidationStrategy'
import * as MODULE_4 from './strategies/JsonFileStrategy'
import * as MODULE_5 from './strategies/SchemaConfigStrategy'

export default {
  ...MODULE_1, //
  ...MODULE_2,
  ...MODULE_3,
  ...MODULE_4,
  ...MODULE_5,
}
