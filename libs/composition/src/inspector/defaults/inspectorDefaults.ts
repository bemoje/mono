import { InspectorOptions } from '../types'
import { inspectDefaults } from './inspectDefaults'
import { ignoreValuesDefaults } from './ignoreValuesDefaults'

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
