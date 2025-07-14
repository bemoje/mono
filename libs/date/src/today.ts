import { stripTime } from './stripTime'

/**
 * Get the UTC date today, time stripped
 */

export function today() {
  return stripTime(new Date(Date.now()))
}
