/**
 * Generates an array of numbers within a specified range.
 * @param start - The start of the range.
 * @param end - The end of the range.
 * @returns An array of numbers from start to end, inclusive.
 * @throws Will throw an error if start is greater than end.
 * @example ```ts
 * numRange(1, 5);
 * //=> [1, 2, 3, 4, 5]
 * numRange(5, 5);
 * //=> [5]
 * ```
 */
export function numRange(start: number, end: number): number[] {
  if (start > end) {
    throw new Error(`Expected start to be less than or equal to end. Got: ${start} > ${end}`)
  }
  if (start === end) return [start]
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}
