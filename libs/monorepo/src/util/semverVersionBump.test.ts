import { describe, it, expect } from 'vitest'
import { semverVersionBump } from './semverVersionBump'

describe('semverVersionBump', () => {
  describe('when version is a string', () => {
    it('should bump the major version', () => {
      const version = '1.0.0'
      const level = 'major'
      const expected = '2.0.0'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })

    it('should bump the minor version', () => {
      const version = '1.0.0'
      const level = 'minor'
      const expected = '1.1.0'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })

    it('should bump the patch version', () => {
      const version = '1.0.0'
      const level = 'patch'
      const expected = '1.0.1'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })
  })

  describe('when version is an array of strings', () => {
    it('should bump the major version', () => {
      const version = ['1', '0', '0']
      const level = 'major'
      const expected = '2.0.0'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })

    it('should bump the minor version', () => {
      const version = ['1', '0', '0']
      const level = 'minor'
      const expected = '1.1.0'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })

    it('should bump the patch version', () => {
      const version = ['1', '0', '0']
      const level = 'patch'
      const expected = '1.0.1'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })
  })

  describe('when version is an array of numbers', () => {
    it('should bump the major version', () => {
      const version = [1, 0, 0]
      const level = 'major'
      const expected = '2.0.0'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })

    it('should bump the minor version', () => {
      const version = [1, 0, 0]
      const level = 'minor'
      const expected = '1.1.0'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })

    it('should bump the patch version', () => {
      const version = [1, 0, 0]
      const level = 'patch'
      const expected = '1.0.1'
      const result = semverVersionBump(version, level)
      expect(result).toEqual(expected)
    })
  })
})
