import type { Option } from '../types'

/** Merge default option values into parsed values where not already set */
export function mergeOptionDefaults(values: Record<string, unknown>, options: Option[]): void {
  for (const option of options) {
    if (option.defaultValue !== undefined && option.name in values) {
      values[option.name] ??= option.defaultValue
    }
  }
}
