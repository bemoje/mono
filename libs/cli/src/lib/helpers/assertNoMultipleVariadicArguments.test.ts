import { describe, expect, it } from 'vitest'
import { assertNoMultipleVariadicArguments } from './assertNoMultipleVariadicArguments'
import type { ICommand } from '../types'

function mockCmd(args: Partial<{ variadic: boolean }>[] = []): ICommand {
  return { arguments: args } as unknown as ICommand
}

describe(assertNoMultipleVariadicArguments.name, () => {
  it('should throw if command already has a variadic argument', () => {
    expect(() => assertNoMultipleVariadicArguments(mockCmd([{ variadic: true }]))).toThrow(
      'Cannot add more than one variadic argument',
    )
  })

  it('should not throw if command has no variadic arguments', () => {
    expect(() => assertNoMultipleVariadicArguments(mockCmd([{ variadic: false }]))).not.toThrow()
  })

  it('should not throw if command has no arguments', () => {
    expect(() => assertNoMultipleVariadicArguments(mockCmd())).not.toThrow()
  })
})
