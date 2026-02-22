import { describe, expect, it } from 'vitest'
import { assertAddRequiredArgumentAllowed } from './assertAddRequiredArgumentAllowed'
import type { ICommand } from '../types'

function mockCmd(args: Partial<{ required: boolean }>[] = []): ICommand {
  return { arguments: args } as unknown as ICommand
}

describe.skip(assertAddRequiredArgumentAllowed.name, () => {
  it('should throw if command has an optional argument', () => {
    expect(() => assertAddRequiredArgumentAllowed(mockCmd([{ required: false }]))).toThrow()
  })

  it('should throw if command has an argument without required set', () => {
    expect(() => assertAddRequiredArgumentAllowed(mockCmd([{}]))).toThrow()
  })

  it('should not throw if all arguments are required', () => {
    expect(() => assertAddRequiredArgumentAllowed(mockCmd([{ required: true }, { required: true }]))).not.toThrow()
  })

  it('should not throw if command has no arguments', () => {
    expect(() => assertAddRequiredArgumentAllowed(mockCmd())).not.toThrow()
  })
})
