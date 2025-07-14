import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Type, Static } from '@sinclair/typebox'
import { SchemaConfigStrategy } from './SchemaConfigStrategy'

describe(SchemaConfigStrategy.name, () => {
  const userSchema = Type.Object({
    name: Type.String({ default: 'Anonymous' }),
    age: Type.Number({ default: 0, minimum: 0 }),
    email: Type.Optional(Type.String()),
    settings: Type.Object(
      {
        theme: Type.Union([Type.Literal('light'), Type.Literal('dark')], { default: 'light' }),
        notifications: Type.Boolean({ default: true }),
      },
      { default: {} },
    ),
  })

  type UserConfig = Static<typeof userSchema>

  it('examples', () => {
    expect(() => {
      const strategy = new SchemaConfigStrategy(userSchema)

      // Validate valid config
      const validConfig: UserConfig = {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        settings: {
          theme: 'dark',
          notifications: false,
        },
      }

      assert.strictEqual(strategy.isValid(validConfig), true, 'valid config should pass validation')

      // Apply defaults to partial config
      const partialConfig = { name: 'Jane', age: 25 }
      const merged = strategy.applyDefaults(partialConfig)

      assert.strictEqual(merged.name, 'Jane', 'provided name should be preserved')
      assert.strictEqual(merged.age, 25, 'provided age should be preserved')
      assert.strictEqual(merged.settings.theme, 'light', 'default theme should be applied')
      assert.strictEqual(merged.settings.notifications, true, 'default notifications should be applied')

      assert.strictEqual(strategy.schema, userSchema, 'schema should be accessible')
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should set schema property', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      expect(strategy.schema).toBe(userSchema)
    })
  })

  describe(SchemaConfigStrategy.prototype.isValid.name, () => {
    it('should return true for valid config', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const validConfig: UserConfig = {
        name: 'John',
        age: 30,
        settings: {
          theme: 'dark',
          notifications: true,
        },
      }

      expect(strategy.isValid(validConfig)).toBe(true)
    })

    it('should return true for config with optional fields missing', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const configWithoutEmail = {
        name: 'John',
        age: 30,
        settings: {
          theme: 'light' as const,
          notifications: true,
        },
      }

      expect(strategy.isValid(configWithoutEmail)).toBe(true)
    })

    it('should return false for config with invalid types', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const invalidConfig = {
        name: 123, // should be string
        age: 30,
        settings: {
          theme: 'light',
          notifications: true,
        },
      }

      expect(strategy.isValid(invalidConfig)).toBe(false)
    })

    it('should return false for config with missing required fields', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const incompleteConfig = {
        name: 'John',
        // missing age and settings
      }

      expect(strategy.isValid(incompleteConfig)).toBe(false)
    })

    it('should return false for config with invalid enum values', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const invalidEnumConfig = {
        name: 'John',
        age: 30,
        settings: {
          theme: 'blue', // should be 'light' or 'dark'
          notifications: true,
        },
      }

      expect(strategy.isValid(invalidEnumConfig)).toBe(false)
    })

    it('should return false for config with negative age', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const negativeAgeConfig = {
        name: 'John',
        age: -5,
        settings: {
          theme: 'light' as const,
          notifications: true,
        },
      }

      expect(strategy.isValid(negativeAgeConfig)).toBe(false)
    })

    it('should return false for non-object input', () => {
      const strategy = new SchemaConfigStrategy(userSchema)

      expect(strategy.isValid(null)).toBe(false)
      expect(strategy.isValid(undefined)).toBe(false)
      expect(strategy.isValid('string')).toBe(false)
      expect(strategy.isValid(123)).toBe(false)
      expect(strategy.isValid([])).toBe(false)
    })
  })

  describe(SchemaConfigStrategy.prototype.assertValid.name, () => {
    it('should not throw for valid config', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const validConfig: UserConfig = {
        name: 'John',
        age: 30,
        settings: {
          theme: 'dark',
          notifications: true,
        },
      }

      expect(() => strategy.assertValid(validConfig)).not.toThrow()
    })

    it('should throw for invalid config', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const invalidConfig = {
        name: 123,
        age: 30,
        settings: {
          theme: 'light',
          notifications: true,
        },
      }

      expect(() => strategy.assertValid(invalidConfig)).toThrow('Invalid config.')
    })

    it('should throw for config with missing required fields', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const incompleteConfig = { name: 'John' }

      expect(() => strategy.assertValid(incompleteConfig)).toThrow('Invalid config.')
    })

    it('should throw for null input', () => {
      const strategy = new SchemaConfigStrategy(userSchema)

      expect(() => strategy.assertValid(null)).toThrow('Invalid config.')
    })

    it('should throw for undefined input', () => {
      const strategy = new SchemaConfigStrategy(userSchema)

      expect(() => strategy.assertValid(undefined)).toThrow('Invalid config.')
    })
  })

  describe(SchemaConfigStrategy.prototype.applyDefaults.name, () => {
    it('should apply all defaults for empty config', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const result = strategy.applyDefaults({})

      expect(result).toEqual({
        name: 'Anonymous',
        age: 0,
        settings: {
          theme: 'light',
          notifications: true,
        },
      })
    })

    it('should apply defaults for undefined input', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const result = strategy.applyDefaults()

      expect(result).toEqual({
        name: 'Anonymous',
        age: 0,
        settings: {
          theme: 'light',
          notifications: true,
        },
      })
    })

    it('should preserve provided values and apply defaults for missing ones', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const partialConfig = {
        name: 'Jane',
        age: 25,
        email: 'jane@example.com',
      }

      const result = strategy.applyDefaults(partialConfig)

      expect(result).toEqual({
        name: 'Jane',
        age: 25,
        email: 'jane@example.com',
        settings: {
          theme: 'light',
          notifications: true,
        },
      })
    })

    it('should handle partial nested objects', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const partialConfig = {
        name: 'Bob',
        age: 35,
        settings: {
          theme: 'dark' as const,
          // notifications missing, should get default
        },
      } as Partial<UserConfig>

      const result = strategy.applyDefaults(partialConfig)

      expect(result).toEqual({
        name: 'Bob',
        age: 35,
        settings: {
          theme: 'dark',
          notifications: true,
        },
      })
    })

    it('should preserve all values when complete config is provided', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const completeConfig: UserConfig = {
        name: 'Alice',
        age: 28,
        email: 'alice@example.com',
        settings: {
          theme: 'dark',
          notifications: false,
        },
      }

      const result = strategy.applyDefaults(completeConfig)

      expect(result).toEqual(completeConfig)
    })

    it('should throw for invalid config after casting', () => {
      const strategy = new SchemaConfigStrategy(userSchema)
      const invalidConfig = {
        name: 'Test',
        age: -10, // violates minimum constraint
        settings: {
          theme: 'light' as const,
          notifications: true,
        },
      } as Partial<UserConfig>

      expect(() => strategy.applyDefaults(invalidConfig)).toThrow('Invalid config.')
    })
  })
})
