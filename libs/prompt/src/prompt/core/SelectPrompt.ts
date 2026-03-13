import { AbstractUserPrompt } from './AbstractUserPrompt'
import type { IChoice } from '../additions/searchPrompt/core/IChoice'
import type { ISelectPrompt } from './types'
import type { Options as PromptsOptions } from 'prompts'
import type { TFormat } from './types'
import type { TOnRender } from './types'
import prompts from 'prompts'

/**
 * Interactive select user prompts in the terminal.
 */
export class SelectPrompt extends AbstractUserPrompt<ISelectPrompt<number>, string> {
  /**
   * @param type - The type of prompt
   * @param message - The message to display to the user
   */
  constructor(message: string) {
    super('select', message)
  }

  /**
   * On render callback. Keyword this refers to the current prompt
   */
  onRender(onRender: TOnRender) {
    this.data.onRender = onRender
    return this
  }

  /**
   * Hint to display to the user
   */
  hint(hint: string) {
    this.data.hint = hint
    return this
  }

  /**
   * Message to display when selecting a disabled option
   */
  warn(warn: string) {
    this.data.warn = warn
    return this
  }

  /**
   * An array of options/choices for the user to select.
   */
  choices(choices: string[]): this
  choices(choices: IChoice<number>[]): this
  choices(choices: string[] | IChoice<number>[]) {
    this.data.choices = choices.map((choice, i) => {
      return typeof choice === 'string'
        ? { title: choice, value: i, disabled: false, selected: false, description: `[${i}] ${choice}` }
        : { value: i, disabled: false, selected: false, description: `[${i}] ${choice.title}`, ...choice }
    })
    return this
  }

  /**
   * Receive user input. The returned value will be added to the response object
   */
  format(format: TFormat<number>) {
    this.data.format = format
    return this
  }

  /**
   * Prompt user and receive user input. The returned value will be added to the response object
   */
  override async run(options?: PromptsOptions): Promise<string> {
    if (!this.data.choices) {
      throw new Error('Choices are required')
    }
    const rval = await prompts(this.data, options)
    const index = rval.value as number
    return this.data.choices[index].title
  }
}
