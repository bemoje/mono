import { AbstractUserPrompt } from './AbstractUserPrompt'
import type { IPasswordPrompt } from './types'
import type { TFormat } from './types'
import type { TOnRender } from './types'
import type { TValidate } from './types'
/**
 * Interactive password user prompts in the terminal.
 */
export class PasswordPrompt<T extends string = string> extends AbstractUserPrompt<IPasswordPrompt<T>, T> {
  /**
   * @param type - The type of prompt
   * @param message - The message to display to the user
   */
  constructor(message: string) {
    super('password', message)
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
   * Receive user input. The returned value will be added to the response object
   */
  format(format: TFormat<T>) {
    this.data.format = format
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
}
