import { InspectOptions, inspect } from 'util'

/**
 * Default options for Node.js util.inspect with enhanced settings for better debugging output.
 */
export const inspectDefaults: InspectOptions = {
  ...inspect.defaultOptions,
  customInspect: true,
  maxStringLength: 500,
  maxArrayLength: 200,
  breakLength: 100,
  colors: true,
  depth: 100,
  compact: false,
  numericSeparator: true,
}
