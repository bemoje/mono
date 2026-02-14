import { describe, expect, it } from 'vitest'
import { assertNoVariadicArgument } from './assertNoVariadicArgument'
import type { ICommand } from '../types'

function mockCmd(args: Partial<{ variadic: boolean }>[] = []): ICommand {
  return { arguments: args } as unknown as ICommand
}

describe(assertNoVariadicArgument.name, () => {
  it('should throw if command has a variadic argument', () => {
    expect(() => assertNoVariadicArgument(mockCmd([{ variadic: true }]))).toThrow(
      'Cannot add optional argument after variadic argument',
    )
  })

  it('should not throw if command has no variadic arguments', () => {
    expect(() => assertNoVariadicArgument(mockCmd([{ variadic: false }]))).not.toThrow()
  })

  it('should not throw if command has no arguments', () => {
    expect(() => assertNoVariadicArgument(mockCmd())).not.toThrow()
  })
})
