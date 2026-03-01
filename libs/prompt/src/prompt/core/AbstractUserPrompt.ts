import type { ICommonPromptFields } from './types'
import type { PromptType } from 'prompts'
import type { Options as PromptsOptions } from 'prompts'
import type { TOnState } from './types'
import type { TStdin } from './types'
import type { TStdout } from './types'
import prompts from 'prompts'
import { setNonEnumerable } from '@bemoje/object'

/**
 * Interactive terminal user prompts.
 */
export abstract class AbstractUserPrompt<Data extends ICommonPromptFields, RVal> {
  /**
   * The data holding the selections from this builder class
   */
  protected data: Data

  /**
   * @param type - The type of prompt
   * @param message - The message to display to the user
   */
  constructor(type: PromptType, message: string) {
    this.data = { name: 'value', type, message } as Data
    setNonEnumerable(this, 'data')
  }

  /**
   * An identifier for the prompt which is only useful when chaining prompts.
   * If provided, the response will be { [name]: value } instead of just the value.
   */
  name(name: string) {
    this.data.name = name
    return this
  }

  /**
   * On state change callback. Function signature is an object with two properties: value and aborted
   */
  onState(onState: TOnState) {
    this.data.onState = onState
    return this
  }

  /**
   * By default, prompts uses process.stdin for receiving input and process.
   * If you need to use different streams, for instance process.stderr,
   * you can set these with the stdin and stdout properties.
   */
  stdin(stdin: TStdin) {
    this.data.stdin = stdin
    return this
  }

  /**
   * By default, prompts uses process.stdout for writing output.
   * If you need to use different streams, for instance process.stderr,
   * you can set these with the stdin and stdout properties.
   */
  stdout(stdout: TStdout) {
    this.data.stdout = stdout
    return this
  }

  /**
   * Returns a copy of the data object.
   */
  getData() {
    return { ...this.data } as Data
  }

  /**
   * Set the data object.
   */
  setData(data: Partial<Data>) {
    Object.assign(this.data, data)
    return this
  }

  /**
   * Create a copy of the this object
   */
  clone() {
    const ctor = Object.getPrototypeOf(this).constructor
    const clone = new ctor(this.data.message)
    Object.assign(clone.data, this.data)
    return clone
  }

  /**
   * Prompt user and receive user input. The returned value will be added to the response object
   */
  async run(options?: PromptsOptions): Promise<RVal> {
    const rval = await prompts(this.data, options)
    return rval.value as RVal
  }
}
