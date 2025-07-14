import ems from 'enhanced-ms'

/**
 * Returns a function that returns the elapsed time since invokation.
 */
export function Timer(startTime: number = Date.now()) {
  return function (endTime: number = Date.now()) {
    const duration = endTime - startTime
    if (duration === 0) return '0ms'
    const string = ems(duration, { useAbbreviations: true })
    return string ?? duration + 'ms'
  }
}
