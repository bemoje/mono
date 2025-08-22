type AcceptedTypes = number | string | boolean | Date | undefined

type UnformattedIndexSignature = {
  [key: string]: AcceptedTypes
}

type From<T> = (value: T) => string

type ToStringFormatter<T extends UnformattedIndexSignature, K extends keyof T = keyof T> = {
  key: K
  format: From<T[K]>
}

type DefaultToStringFormatter<T extends UnformattedIndexSignature, K extends keyof T = keyof T> = {
  format: From<T[K]>
}

export interface FormatAsStringTableOptions<T extends UnformattedIndexSignature> {
  data: T[]
  stringFormatters: Array<ToStringFormatter<T>>
  defaultFormatter?: DefaultToStringFormatter<T>
}

/**
 * Formats an array of objects into a string table with customizable column formatters.
 */
export function formatAsStringTable<T extends UnformattedIndexSignature, U extends object>(
  opts: FormatAsStringTableOptions<T>,
): U[] {
  return opts.data.map((obj) => {
    const objectOfStringVals = getEntriesOnObjectWithStringVal(obj)
    const objectOfDefaultVals = getDefaultFormattedObj(obj)
    const objectOfFormattedVals = formatEntriesOnObjectWithNonStringVals(obj)
    return Object.assign({}, objectOfStringVals, objectOfDefaultVals, objectOfFormattedVals)
  }) as U[]

  function getEntriesOnObjectWithStringVal(obj: T) {
    return Object.entries(obj).reduce(
      (acc, [key, val]) => {
        if (typeof val !== 'string') return acc
        acc[key as keyof T] = val
        return acc
      },
      {} as { [K in keyof T]: string },
    )
  }

  function getDefaultFormattedObj(obj: T) {
    if (!opts.defaultFormatter) return {}
    return Object.entries(obj).reduce(
      (acc, [key, val]) => {
        acc[key as keyof T] = opts.defaultFormatter!.format(val as T[keyof T])
        return acc
      },
      {} as { [K in keyof T]: string },
    )
  }

  function formatEntriesOnObjectWithNonStringVals(obj: T) {
    if (opts.stringFormatters.length === 0) return {}
    const formatterMap = opts.stringFormatters.reduce(
      (acc, formatter) => {
        acc[formatter.key as string] = formatter
        return acc
      },
      {} as Record<string, ToStringFormatter<T>>,
    )

    return Object.entries(obj).reduce(
      (acc, [key, val]) => {
        const formatter = formatterMap[key]
        if (!formatter) return acc
        acc[key as keyof T] = formatter.format(val as T[keyof T])
        return acc
      },
      {} as { [K in keyof T]: string },
    )
  }
}
