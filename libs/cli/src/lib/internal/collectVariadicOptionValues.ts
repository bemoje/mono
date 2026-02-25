import type { Option } from '../types'

/** Collect consecutive positional tokens into variadic string option values */
export function collectVariadicOptionValues(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsed: { tokens: any[]; values: any; positionals: string[] },
  options: Option[],
): void {
  for (let i = 0; i < parsed.tokens.length; i++) {
    const token = parsed.tokens[i]
    if (token.kind !== 'option') {
      continue
    }

    const def = options.find((o) => {
      return o.name === token.name
    })
    if (!def?.variadic || def.type !== 'string') {
      continue
    }

    const values = [token.value]
    let j = i + 1
    while (j < parsed.tokens.length && parsed.tokens[j].kind === 'positional') {
      const positionalToken = parsed.tokens[j]
      values.push(positionalToken.value)
      const posIndex = parsed.positionals.indexOf(positionalToken.value)
      if (posIndex !== -1) {
        parsed.positionals.splice(posIndex, 1)
      }
      j++
    }

    Reflect.set(
      parsed.values,
      token.name,
      values.filter((v): v is string => {
        return v !== undefined
      }),
    )
  }
}
