import { stripTime } from './stripTime'
import { subDays } from 'date-fns'
import { today } from './today'

/**
 * Get the UTC date yesterday, time stripped
 */
export function yesterday() {
  return stripTime(subDays(today(), 1))
}
