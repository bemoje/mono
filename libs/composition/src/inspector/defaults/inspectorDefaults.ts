import type { InspectorOptions } from '../types'
import { ignoreValuesDefaults } from './ignoreValuesDefaults'
import { inspectDefaults } from './inspectDefaults'

/**
 * The default inspector configuration options.
 */
export const inspectorDefaults: Required<InspectorOptions> = {
  inspect: inspectDefaults,
  ignoreValues: ignoreValuesDefaults,
  keys: [],
  autoAddBooleanKeys: false,
  ignoreKeys: [],
  filters: [],
}
