import { describe, expect, it } from 'vitest'
import { setLength } from './setLength'

describe(setLength.name, () => {
  it('should set the length of a function', () => {
    const fn = (a: number, b: number, c: number) => a + b + c
    const modifiedFn = setLength(2, fn)
    expect(modifiedFn.length).to.equal(2)
  })

  it('should set the length of a function using an object', () => {
    const fn = (a: number, b: number, c: number) => a + b + c
    const modifiedFn = setLength({ length: 1 }, fn)
    expect(modifiedFn.length).to.equal(1)
  })

  it('should not affect other properties of the function', () => {
    const fn = (a: number, b: number, c: number) => a + b + c
    const modifiedFn = setLength(2, fn)
    expect(modifiedFn.name).to.equal(fn.name)
    expect(modifiedFn.toString()).to.equal(fn.toString())
  })
})
