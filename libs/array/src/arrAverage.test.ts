import { arrAverage } from './arrAverage'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(arrAverage.name, () => {
  it('should calculate the average of the provided array', () => {
    expect(arrAverage([1, 2, 3, 4, 5])).toBe(3)
  })

  it('should throw an error if the input array is empty', () => {
    expect(() => {
      return arrAverage([])
    }).toThrowError('Cannot take an average of zero values.')
  })
})
