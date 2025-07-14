/**
 * Counts the number of decimal places in a floating-point number.
 */
export function countFloatDecimals(float?: unknown): number {
  return typeof float === 'number' ? (float.toString().split('.')[1]?.length ?? 0) : 0
}
