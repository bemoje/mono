import { AbstractUserPrompt } from './AbstractUserPrompt'
import type { INumberPrompt } from './types'
import type { TOnRender } from './types'
import type { TStyle } from './types'
import type { TValidate } from './types'

/**
 * Interactive numner user prompts in the terminal.
 */
export class NumberPrompt<T extends number = number> extends AbstractUserPrompt<INumberPrompt<T>, T> {
  /**
   * @param type - The type of prompt
   * @param message - The message to display to the user
   */
  constructor(message: string) {
    super('number', message)
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
   * Render style
   */
  style(style: TStyle = 'default') {
    this.data.style = style
    return this
  }

  /**
   * Allow floating point inputs.
   */
  float(float = false) {
    this.data.float = float
    return this
  }

  /**
   * Round float values to x decimals.
   */
  round(round = 2) {
    this.data.round = round
    return this
  }

  /**
   * Increment step when using arrow keys.
   */
  increment(increment = 1) {
    this.data.increment = increment
    return this
  }
}
