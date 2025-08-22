import { isValidNumber } from '@mono/is'
import { NumberFormatter } from './NumberFormatter'

/**
 * Determine whether a set of valid number strings are formatted in da-DK or en-US locale.
 *
 * @param values - An iterable of strings that may or may not be numbers.
 *
 * @remarks
 * When encountering a value of which locale cannot be distinguished, it is skipped.
 * As soon as a value is encountered that can be only be from one locale, that locale is immediately returned.
 * If none are encountered, undefined is returned.
 *
 * @throws TypeError if a value is not a valid number.
 */
export function determineNumberLocale(values: Iterable<string>): 'da' | 'en' | undefined {
  for (let value of values) {
    value = value.replace(/^-|\s/g, '')

    if (reIsInt.test(value)) {
      continue
    }

    if ((reHasComma.test(value) && reHasPeriod.test(value)) || reStartsWithDecimalSep.test(value)) {
      if (reStartsWithDecimalSep.test(value)) value = '0' + value
      if (reCouldBeDA.test(value) && isValidNumber(numberFormatterDa.parse(value))) {
        return 'da'
      }
      if (reCouldBeEN.test(value) && isValidNumber(numberFormatterEn.parse(value))) {
        return 'en'
      }
      throw new TypeError('Invalid number format: ' + value)
    }

    if (reCouldBeDA.test(value)) {
      if (!reCouldBeEN.test(value) && isValidNumber(numberFormatterDa.parse(value))) {
        return 'da'
      }
    } else if (reCouldBeEN.test(value)) {
      if (!reCouldBeDA.test(value) && isValidNumber(numberFormatterEn.parse(value))) {
        return 'en'
      }
    }
  }
  return undefined
}

const numberFormatterDa = new NumberFormatter(2).locale('da-DK')
const numberFormatterEn = new NumberFormatter(2).locale('en-US')

const reCouldBeDA = /^([0-9]{1,3})*(\.[0-9]{3})*(,[0-9]+)?$/
const reCouldBeEN = /^([0-9]{1,3})*(,[0-9]{3})*(\.[0-9]+)?$/
const reHasComma = /,/
const reHasPeriod = /\./
const reStartsWithDecimalSep = /^[,.]/
const reIsInt = /^[0-9]+$/
