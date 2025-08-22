import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import fs from 'fs-extra'
import upath from 'upath'
import { JsonFileStrategy } from './JsonFileStrategy'
import { getTempDataPath } from '@mono/os'

describe(JsonFileStrategy.name, () => {
  const testDir = getTempDataPath('JsonFileStrategy')
  const testFilePath = upath.join(testDir, 'test-config.json')

  beforeEach(async () => {
    await fs.ensureDir(testDir)
  })

  afterEach(async () => {
    await fs.remove(testDir)
  })

  it('examples', () => {
    expect(() => {
      const strategy = new JsonFileStrategy<{ name: string; age: number }>(testFilePath)

      // Save config
      const config = { name: 'John', age: 30 }
      strategy.save(config)

      // Load config
      const loaded = strategy.load()

      assert.deepStrictEqual(loaded, config, 'loaded config should match saved config')
      assert.strictEqual(strategy.filepath, testFilePath, 'filepath should be set')
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should set filepath property', () => {
      const strategy = new JsonFileStrategy(testFilePath)
      expect(strategy.filepath).toBe(testFilePath)
    })
  })

  describe(JsonFileStrategy.prototype.load.name, () => {
    it('should return undefined when file does not exist', () => {
      const strategy = new JsonFileStrategy(testFilePath)
      const result = strategy.load()
      expect(result).toBeUndefined()
    })

    it('should load valid JSON from existing file', () => {
      const testData = { name: 'Test', value: 42, nested: { prop: true } }
      fs.outputJsonSync(testFilePath, testData)

      const strategy = new JsonFileStrategy<typeof testData>(testFilePath)
      const result = strategy.load()

      expect(result).toEqual(testData)
    })

    it('should handle empty object', () => {
      fs.outputJsonSync(testFilePath, {})

      const strategy = new JsonFileStrategy<object>(testFilePath)
      const result = strategy.load()

      expect(result).toEqual({})
    })

    it('should handle arrays', () => {
      const testData = [1, 2, 3, { name: 'item' }]
      fs.outputJsonSync(testFilePath, testData)

      const strategy = new JsonFileStrategy<typeof testData>(testFilePath)
      const result = strategy.load()

      expect(result).toEqual(testData)
    })

    it('should throw error for invalid JSON', () => {
      fs.writeFileSync(testFilePath, 'invalid json content')

      const strategy = new JsonFileStrategy(testFilePath)
      expect(() => strategy.load()).toThrow()
    })
  })

  describe(JsonFileStrategy.prototype.save.name, () => {
    it('should save object to JSON file with proper formatting', () => {
      const testData = { name: 'Test', value: 42 }
      const strategy = new JsonFileStrategy<typeof testData>(testFilePath)

      strategy.save(testData)

      expect(fs.existsSync(testFilePath)).toBe(true)
      const content = fs.readFileSync(testFilePath, 'utf8')
      expect(content).toContain('{\n  "name": "Test",\n  "value": 42\n}')
    })

    it('should create directory if it does not exist', () => {
      const deepPath = upath.join(testDir, 'deep', 'nested', 'path', 'config.json')
      const strategy = new JsonFileStrategy(deepPath)

      strategy.save({ test: true })

      expect(fs.existsSync(deepPath)).toBe(true)
      expect(fs.readJsonSync(deepPath)).toEqual({ test: true })
    })

    it('should overwrite existing file', () => {
      const strategy = new JsonFileStrategy<{ count: number }>(testFilePath)

      strategy.save({ count: 1 })
      expect(fs.readJsonSync(testFilePath)).toEqual({ count: 1 })

      strategy.save({ count: 2 })
      expect(fs.readJsonSync(testFilePath)).toEqual({ count: 2 })
    })

    it('should handle complex nested objects', () => {
      const complexData = {
        user: {
          profile: {
            name: 'John',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        permissions: ['read', 'write'],
        metadata: null,
      }

      const strategy = new JsonFileStrategy<typeof complexData>(testFilePath)
      strategy.save(complexData)

      const loaded = strategy.load()
      expect(loaded).toEqual(complexData)
    })

    it('should handle arrays', () => {
      const arrayData = [
        { id: 1, name: 'First' },
        { id: 2, name: 'Second' },
      ]

      const strategy = new JsonFileStrategy<typeof arrayData>(testFilePath)
      strategy.save(arrayData)

      const loaded = strategy.load()
      expect(loaded).toEqual(arrayData)
    })
  })
})
