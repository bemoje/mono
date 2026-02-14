import { describe, expect, it } from 'vitest'
import { assertNoOptionalOrVariadicArguments } from './assertNoOptionalOrVariadicArguments'
import type { ICommand } from '../types'

function mockCmd(args: Partial<{ required: boolean }>[] = []): ICommand {
  return { arguments: args } as unknown as ICommand
}

describe(assertNoOptionalOrVariadicArguments.name, () => {
  it('should throw if command has an optional argument', () => {
    expect(() => assertNoOptionalOrVariadicArguments(mockCmd([{ required: false }]))).toThrow(
      'Cannot add required argument after optional or variadic arguments',
    )
  })

  it('should throw if command has an argument without required set', () => {
    expect(() => assertNoOptionalOrVariadicArguments(mockCmd([{}]))).toThrow(
      'Cannot add required argument after optional or variadic arguments',
    )
  })

  it('should not throw if all arguments are required', () => {
    expect(() =>
      assertNoOptionalOrVariadicArguments(mockCmd([{ required: true }, { required: true }])),
    ).not.toThrow()
  })

  it('should not throw if command has no arguments', () => {
    expect(() => assertNoOptionalOrVariadicArguments(mockCmd())).not.toThrow()
  })
})
