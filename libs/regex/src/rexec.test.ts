import { describe, expect, it } from 'vitest'
import { rexec } from './rexec'

describe(rexec.name, () => {
  it('example', () => {
    const re = /(?<g1>a)/g
    const str = 'Anthony wants a girlfriend.'
    const result = [...rexec(re, str)]
    expect(result).toStrictEqual([
      {
        index: 9,
        match: 'a',
        groups: { g1: 'a' },
        lastIndex: 10,
        location: [1, 9],
      },
      {
        index: 14,
        match: 'a',
        groups: { g1: 'a' },
        lastIndex: 15,
        location: [1, 14],
      },
    ])
  })

  it('should return an array that has the correct match details', () => {
    const res = rexec(/a(b)c/g, 'abc')
    expect(res[0]).toEqual({
      index: 0,
      lastIndex: 3,
      location: [1, 0],
      groups: {},
      match: 'abc',
    })
    expect(res).toHaveLength(1)
  })

  it('should return an array that has the correct match details for multiple matches', () => {
    const res = rexec(/a(b)c/g, 'abc abc')
    expect(res[0]).toEqual({
      index: 0,
      lastIndex: 3,
      location: [1, 0],
      groups: {},
      match: 'abc',
    })
    expect(res[1]).toEqual({
      index: 4,
      lastIndex: 7,
      location: [1, 4],
      groups: {},
      match: 'abc',
    })
    expect(res).toHaveLength(2)
  })

  it('should correctly handle regex with groups', () => {
    const res = rexec(/a(b)c/g, 'abc')
    expect(res[0]).toEqual({
      index: 0,
      lastIndex: 3,
      location: [1, 0],
      groups: {},
      match: 'abc',
    })
  })
})
