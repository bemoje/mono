/**
 * Determines if a specified cooldown period has elapsed since a given date.
 *
 * @param startDate - The starting date to calculate elapsed time from.
 * @param cooldownMs - The cooldown duration in milliseconds.
 * @returns `true` if the cooldown period has elapsed, otherwise `false`.
 */
export function hasCooldownElapsed(startDate: Date, cooldownMs: number): boolean {
  const elapsedMs = Date.now() - startDate.getTime()
  return elapsedMs > cooldownMs
}
