export * from './IView'
export * from './View'
export * from './inheritProxifiedPrototype'
export * from './inheritProxifiedPrototypeProperty'
export * from './inspector/Inspector'
export * from './inspector/defaults/ignoreValuesDefaults'
export * from './inspector/defaults/ignoreValuesFilterDefaults'
export * from './inspector/defaults/inspectDefaults'
export * from './inspector/defaults/inspectorDefaults'
export * from './inspector/types'
export * from './parenting/ParentRelationTypes'
export * from './parenting/Parenting'
export * from './parenting/types'

import * as MODULE_01 from './IView'
import * as MODULE_02 from './View'
import * as MODULE_03 from './inheritProxifiedPrototype'
import * as MODULE_04 from './inheritProxifiedPrototypeProperty'
import * as MODULE_05 from './inspector/Inspector'
import * as MODULE_06 from './inspector/defaults/ignoreValuesDefaults'
import * as MODULE_07 from './inspector/defaults/ignoreValuesFilterDefaults'
import * as MODULE_08 from './inspector/defaults/inspectDefaults'
import * as MODULE_09 from './inspector/defaults/inspectorDefaults'
import * as MODULE_10 from './inspector/types'
import * as MODULE_11 from './parenting/ParentRelationTypes'
import * as MODULE_12 from './parenting/Parenting'
import * as MODULE_13 from './parenting/types'

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
  ...MODULE_13,
}
