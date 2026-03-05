import { AbstractUserPrompt } from './AbstractUserPrompt'
import type { Any } from '@mono/types'
import type { IDatePrompt } from './types'
import type { LocalesMonths } from '@mono/types'
import type { LocalesWeeks } from '@mono/types'
import type { Options as PromptsOptions } from 'prompts'
import type { TOnRender } from './types'
import type { TValidate } from './types'
import prompts from 'prompts'

/**
 * Interactive date user prompts in the terminal.
 */
export class DatePrompt<T extends Date = Date> extends AbstractUserPrompt<IDatePrompt<T>, T> {
  /**
   * @param type - The type of prompt
   * @param message - The message to display to the user
   */
  constructor(message: string) {
    super('date', message)
  }

  /**
   * On render callback. Keyword this refers to the current prompt
   */
  onRender(onRender: TOnRender) {
    this.data.onRender = onRender
    return this
  }

  /**
   * Default value
   */
  initial(initial: T) {
    this.data.initial = initial
    return this
  }

  /**
   * Receive user input. Should return true if the value is valid, and an error message String otherwise.
   * If false is returned, a default error message is shown
   */
  validate(validate: TValidate<T>) {
    this.data.validate = validate
    return this
  }

  /**
   * Use to define custom locales. See below for an example.
   * More info: https://github.com/terkelg/prompts/wiki/Date-Time-Formatting
   */
  locales(locales: LocalesMonths & LocalesWeeks) {
    this.data.locales = locales as Any
    return this
  }

  /**
   * The format mask of the date. See below for more information.
   * More info: https://github.com/terkelg/prompts/wiki/Date-Time-Formatting
   */
  mask(mask = 'YYYY-MM-DD HH:mm:ss') {
    this.data.mask = mask
    return this
  }

  /**
   * Prompt user and receive user input. The returned value will be added to the response object
   */
  override async run(options?: PromptsOptions): Promise<T> {
    const rval = await prompts(this.data, options)
    return new Date(rval.value) as T
  }
}
