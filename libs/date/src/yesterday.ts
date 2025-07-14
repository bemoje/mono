import { subDays } from 'date-fns/subDays'
import { today } from './today'
import { stripTime } from './stripTime'

/**
 * Get the UTC date yesterday, time stripped
 */
export function yesterday() {
  return stripTime(subDays(today(), 1))
}
