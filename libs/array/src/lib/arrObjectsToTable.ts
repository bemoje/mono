import { arrObjectsUniqueKeys } from './arrObjectsUniqueKeys'

/**
 * Convert an array of objects to a two-dimensional table.
 * @param objects The array of objects to convert to a table.
 * @template T - The type of the values in the objects.
 * @param options.headers An optional array of strings specifying the headers (property names) to use. If not provided, the function will use all unique keys found in the objects.
 * @param options.emptyCell An optional value to use for empty cells. If not provided, the function will use `undefined`.
 * @returns A 2D array (table) where each row represents an object and each column represents a property of the object.
 * @param options The options for converting the objects to a table.
 * @example ```ts
 * arrObjectsToTable(
 *   [
 *     { a: 1, b: 2 },
 *     { a: 3, b: 4, c: 5 },
 *   ],
 *   { emptyCell:1 },
 * ) //=> [ [ 'a', 'b', 'c' ], [ 1, 2,1 ], [ 3, 4, 5 ] ]
 * ```
 */
export function arrObjectsToTable<T, E>(
  objects: Record<string, T | undefined>[],
  options: {
    headers?: string[]
    emptyCell?: E
  } = {},
): Array<Array<string | T | E>> {
  const headers = options?.headers?.slice() || arrObjectsUniqueKeys(objects)
  const table: Array<Array<string | T | E>> = [headers]
  for (const o of objects) {
    const row = headers.map((header) => {
      const value = o[header]
      return value !== undefined ? value : (options.emptyCell as E)
    })
    table.push(row)
  }
  return table
}
