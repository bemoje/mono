import { describe, expect, it } from 'vitest'
import { setName } from './setName'

describe(setName.name, () => {
  it('should set the name of a function', () => {
    const fn = function () {}
    const namedFn = setName('myFunction', fn)
    expect(namedFn.name).toBe('myFunction')
  })

  it('should set the name of a function using an object', () => {
    const fn = function () {}
    const namedFn = setName({ name: 'myFunction' }, fn)
    expect(namedFn.name).toBe('myFunction')
  })

  it('should return the target object', () => {
    const obj = {}
    const result = setName('myFunction', obj)
    expect(result).toBe(obj)
  })
})
