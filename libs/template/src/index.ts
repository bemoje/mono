export * from './Template/Template'
export * from './interfaces/TemplateStrategy'
export * from './strategies/JsonFileTemplateStrategy'
export * from './strategies/StringTemplateStrategy'
export * from './strategies/TextFileTemplateStrategy'

import * as MODULE_1 from './Template/Template'
import * as MODULE_2 from './interfaces/TemplateStrategy'
import * as MODULE_3 from './strategies/JsonFileTemplateStrategy'
import * as MODULE_4 from './strategies/StringTemplateStrategy'
import * as MODULE_5 from './strategies/TextFileTemplateStrategy'

export default {
  ...MODULE_1, //
  ...MODULE_2,
  ...MODULE_3,
  ...MODULE_4,
  ...MODULE_5,
}
