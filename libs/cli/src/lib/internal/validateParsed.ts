import { entriesOf } from '@mono/object'
import type { Argument } from "../types";
import type { Option } from "../types";

/** Validate parsed arguments and option values, returning errors or undefined */
export function validateParsed(
  args: unknown[],
  optionValues: Record<string, unknown>,
  argDefs: Argument[],
  optionDefs: Option[],
): string[] | undefined {
  return argDefs
    .map((def, index) => {
      const value = args[index]
      if (def.required) {
        if (def.variadic ? Array.isArray(value) && value.length === 0 : value === undefined) {
          return `Missing argument [${index}] ${def.usage}`
        }
      }
      if (def.choices && value !== undefined) {
        if (![value].flat().every((v) => def.choices!.includes(v as string))) {
          return `Invalid argument [${index}] ${def.usage}: Got \`${value}\`. Accepted values: [${def.choices.map((c) => `\`${c}\``).join(',')}]`
        }
      }
    })
    .concat(
      entriesOf(optionValues).map(([key, value]) => {
        const def = optionDefs.find((o) => o.name === key)!
        if (!def) return `Unknown option --${key}`
        if (def.choices && value !== undefined) {
          if (!((def.variadic ? value : [value]) as string[]).every((v) => def.choices!.includes(v))) {
            return `Invalid option value ${def.flags}: Got \`${value}\`. Accepted values: [${def.choices.map((c) => `\`${c}\``).join(',')}]`
          }
        }
      }),
    )
    .filter((s) => s !== undefined)
    .reduce(
      (acc, curr) => {
        return (acc ?? []).concat(curr)
      },
      undefined as string[] | undefined,
    )
}
