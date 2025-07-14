import { round } from './round'

const locales: Map<string, [string, string]> = new Map([
  ['en-US', [',', '.']],
  ['da-DK', ['.', ',']],
])

export class NumberFormatter {
  // The number of decimals to round to.
  public precision: number

  // The character to use as thousand separator.
  public thousandSeparator = ','

  // The character to use as decimal separator.
  public decimalSeparator = '.'

  /**
   * Create a new number formatter.
   * @param precision The number of decimals to round to.
   */
  constructor(precision = 2) {
    this.precision = precision
  }

  /**
   * Set separator strings for a given locale.
   */
  static defineLocale(locale: string, thousandSeparator: string, decimalSeparator: string): void {
    locales.set(locale, [thousandSeparator, decimalSeparator])
  }

  /**
   * Returns a copy of the locales map.
   */
  static getLocales(): Map<string, [string, string]> {
    const result = new Map<string, [string, string]>()
    for (const entry of locales.entries()) {
      result.set(entry[0], [entry[1][0], entry[1][1]])
    }
    return result
  }

  /**
   * Set the locale for the number formatter.
   */
  locale(locale: string): this {
    const sep = locales.get(locale)
    if (!sep) throw new Error(`Invalid locale: ${locale}. Valid: ${Array.from(locales.keys())}}.`)
    this.thousandSeparator = sep[0]
    this.decimalSeparator = sep[1]
    return this
  }

  /**
   * Format a number to a string.
   */
  format(number: number): string {
    const negative = number >= 0 ? '' : '-'
    const split = Math.abs(round(number, this.precision)).toString().split('.')
    const decimals = this.precision ? this.decimalSeparator + (split[1] || '').padEnd(this.precision, '0') : ''
    let result = ''
    for (let i = 0; i < split[0].length; i++) {
      if (i % 3 === 0 && i !== 0) {
        result = this.thousandSeparator + result
      }
      result = split[0][split[0].length - i - 1] + result
    }
    return negative + result + decimals
  }

  /**
   * Parse a formatted string to a number.
   */
  parse(string: string): number {
    string = string
      .replaceAll(this.thousandSeparator, '')
      .replace(this.decimalSeparator, '.')
      .replace(/[^\d.-]/g, '')
      .split('.')
      .map((s) => parseInt(s))
      .join('.')
    const n = Number(string)
    return n
  }
}
