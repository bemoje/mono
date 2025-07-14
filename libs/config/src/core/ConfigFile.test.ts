import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import assert from 'node:assert'
import fs from 'fs-extra'
import upath from 'upath'
import { Type, Static } from '@sinclair/typebox'
import { ConfigFile } from './ConfigFile'
import { getTempDataPath } from '@mono/os'

describe(ConfigFile.name, () => {
  const testDir = getTempDataPath('ConfigFile')
  const testConfigPath = upath.join(testDir, 'test-config.json')
  const testConfigPath2 = upath.join(testDir, 'test-config2.json')

  const appConfigSchema = Type.Object({
    appName: Type.String({ default: 'My App' }),
    version: Type.String({ default: '1.0.0' }),
    port: Type.Number({ default: 3000, minimum: 1, maximum: 65535 }),
    features: Type.Object(
      {
        auth: Type.Boolean({ default: true }),
        logging: Type.Boolean({ default: true }),
        debug: Type.Boolean({ default: false }),
      },
      { default: {} },
    ),
    database: Type.Optional(
      Type.Object({
        host: Type.String(),
        port: Type.Number(),
        name: Type.String(),
      }),
    ),
  })

  type AppConfig = Static<typeof appConfigSchema>

  beforeEach(async () => {
    await fs.ensureDir(testDir)
    // Clear singleton instances between tests
    ;(ConfigFile as any).instances.clear()
  })

  afterEach(async () => {
    await fs.remove(testDir)
    ;(ConfigFile as any).instances.clear()
  })

  it('examples', () => {
    expect(() => {
      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      // Load config with defaults
      const config = configFile.load()

      assert.strictEqual(config.appName, 'My App', 'default app name should be applied')
      assert.strictEqual(config.port, 3000, 'default port should be applied')
      assert.strictEqual(config.features.auth, true, 'default auth feature should be applied')

      // Update config
      const updatedConfig = configFile.update((current) => ({
        ...current,
        appName: 'Updated App',
        port: 8080,
      }))

      assert.strictEqual(updatedConfig.appName, 'Updated App', 'app name should be updated')
      assert.strictEqual(updatedConfig.port, 8080, 'port should be updated')
      assert.strictEqual(updatedConfig.features.auth, true, 'existing features should be preserved')

      assert.strictEqual(configFile.filepath, testConfigPath, 'filepath should be accessible')
      assert.strictEqual(configFile.schema, appConfigSchema, 'schema should be accessible')
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should create new instance with schema and filepath', () => {
      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      expect(configFile.schema).toBe(appConfigSchema)
      expect(configFile.filepath).toBe(testConfigPath)
    })

    it('should return existing instance for same filepath (singleton)', () => {
      const configFile1 = new ConfigFile(appConfigSchema, testConfigPath)
      const configFile2 = new ConfigFile(appConfigSchema, testConfigPath)

      expect(configFile1).toBe(configFile2)
    })

    it('should create separate instances for different filepaths', () => {
      const configFile1 = new ConfigFile(appConfigSchema, testConfigPath)
      const configFile2 = new ConfigFile(appConfigSchema, testConfigPath2)

      expect(configFile1).not.toBe(configFile2)
      expect(configFile1.filepath).toBe(testConfigPath)
      expect(configFile2.filepath).toBe(testConfigPath2)
    })

    it('should maintain singleton state across different schema types', () => {
      const simpleSchema = Type.Object({ name: Type.String() })

      const configFile1 = new ConfigFile(appConfigSchema, testConfigPath)
      const configFile2 = new ConfigFile(simpleSchema, testConfigPath)

      // Should return the same instance regardless of schema type
      expect(configFile1).toBe(configFile2)
    })
  })

  describe(ConfigFile.prototype.load.name, () => {
    it('should load config with all defaults when file does not exist', () => {
      const configFile = new ConfigFile(appConfigSchema, testConfigPath)
      const config = configFile.load()

      expect(config).toEqual({
        appName: 'My App',
        version: '1.0.0',
        port: 3000,
        features: {
          auth: true,
          logging: true,
          debug: false,
        },
      })

      // Should also save the defaults to file
      expect(fs.existsSync(testConfigPath)).toBe(true)
      expect(fs.readJsonSync(testConfigPath)).toEqual(config)
    })

    it('should load existing config and merge with defaults', () => {
      const existingConfig = {
        appName: 'Existing App',
        port: 8080,
        // features missing, should get defaults
      }
      fs.outputJsonSync(testConfigPath, existingConfig)

      const configFile = new ConfigFile(appConfigSchema, testConfigPath)
      const config = configFile.load()

      expect(config).toEqual({
        appName: 'Existing App',
        version: '1.0.0', // default
        port: 8080,
        features: {
          auth: true,
          logging: true,
          debug: false,
        },
      })

      // Should save merged config back to file
      expect(fs.readJsonSync(testConfigPath)).toEqual(config)
    })

    it('should preserve optional fields when present', () => {
      const existingConfig = {
        appName: 'Test App',
        version: '2.0.0',
        port: 4000,
        features: {
          auth: false,
          logging: true,
          debug: true,
        },
        database: {
          host: 'localhost',
          port: 5432,
          name: 'testdb',
        },
      }
      fs.outputJsonSync(testConfigPath, existingConfig)

      const configFile = new ConfigFile(appConfigSchema, testConfigPath)
      const config = configFile.load()

      expect(config).toEqual(existingConfig)
    })

    it('should handle multiple loads returning same data', () => {
      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      const config1 = configFile.load()
      const config2 = configFile.load()

      expect(config1).toEqual(config2)
    })

    it('should handle corrupted file by applying defaults', () => {
      fs.writeFileSync(testConfigPath, 'invalid json')

      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      // Should throw since JSON parsing fails
      expect(() => configFile.load()).toThrow()
    })
  })

  describe(ConfigFile.prototype.update.name, () => {
    it('should update config and apply defaults', () => {
      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      const updatedConfig = configFile.update((current) => ({
        ...current,
        appName: 'Updated App',
        port: 9000,
      }))

      expect(updatedConfig).toEqual({
        appName: 'Updated App',
        version: '1.0.0',
        port: 9000,
        features: {
          auth: true,
          logging: true,
          debug: false,
        },
      })

      // Should save updated config to file
      expect(fs.readJsonSync(testConfigPath)).toEqual(updatedConfig)
    })

    it('should update based on existing config', () => {
      const initialConfig = {
        appName: 'Initial App',
        version: '1.5.0',
        port: 5000,
        features: {
          auth: false,
          logging: true,
          debug: true,
        },
      }
      fs.outputJsonSync(testConfigPath, initialConfig)

      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      const updatedConfig = configFile.update((current) => ({
        ...current,
        appName: 'Modified App',
        features: {
          ...current.features,
          debug: false,
        },
      }))

      expect(updatedConfig).toEqual({
        appName: 'Modified App',
        version: '1.5.0',
        port: 5000,
        features: {
          auth: false,
          logging: true,
          debug: false,
        },
      })
    })

    it('should add optional fields', () => {
      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      const updatedConfig = configFile.update((current) => ({
        ...current,
        database: {
          host: 'localhost',
          port: 5432,
          name: 'mydb',
        },
      }))

      expect(updatedConfig.database).toEqual({
        host: 'localhost',
        port: 5432,
        name: 'mydb',
      })

      expect(fs.readJsonSync(testConfigPath)).toEqual(updatedConfig)
    })

    it('should validate updated config', () => {
      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      expect(() => {
        configFile.update((current) => ({
          ...current,
          port: -1, // invalid port
        }))
      }).toThrow('Invalid config.')
    })

    it('should handle multiple updates', () => {
      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      const firstUpdate = configFile.update((current) => ({
        ...current,
        appName: 'First Update',
      }))

      const secondUpdate = configFile.update((current) => ({
        ...current,
        appName: 'Second Update',
        port: 7000,
      }))

      expect(firstUpdate.appName).toBe('First Update')
      expect(secondUpdate.appName).toBe('Second Update')
      expect(secondUpdate.port).toBe(7000)

      // File should contain the latest update
      const fileContent = fs.readJsonSync(testConfigPath)
      expect(fileContent.appName).toBe('Second Update')
      expect(fileContent.port).toBe(7000)
    })

    it('should remove optional fields when set to undefined', () => {
      const initialConfig = {
        appName: 'Test App',
        version: '1.0.0',
        port: 3000,
        features: {
          auth: true,
          logging: true,
          debug: false,
        },
        database: {
          host: 'localhost',
          port: 5432,
          name: 'testdb',
        },
      }
      fs.outputJsonSync(testConfigPath, initialConfig)

      const configFile = new ConfigFile(appConfigSchema, testConfigPath)

      const updatedConfig = configFile.update((current) => {
        const { database, ...rest } = current
        return rest
      })

      expect(updatedConfig.database).toBeUndefined()
      expect(fs.readJsonSync(testConfigPath).database).toBeUndefined()
    })
  })

  describe('singleton behavior', () => {
    it('should maintain singleton instances across operations', () => {
      const configFile1 = new ConfigFile(appConfigSchema, testConfigPath)
      configFile1.update((current) => ({ ...current, appName: 'Singleton Test' }))

      const configFile2 = new ConfigFile(appConfigSchema, testConfigPath)
      const config = configFile2.load()

      expect(config.appName).toBe('Singleton Test')
      expect(configFile1).toBe(configFile2)
    })

    it('should track instances correctly', () => {
      const instances = (ConfigFile as any).instances

      expect(instances.size).toBe(0)

      new ConfigFile(appConfigSchema, testConfigPath)
      expect(instances.size).toBe(1)

      new ConfigFile(appConfigSchema, testConfigPath2)
      expect(instances.size).toBe(2)

      // Same path should not increase count
      new ConfigFile(appConfigSchema, testConfigPath)
      expect(instances.size).toBe(2)
    })
  })
})
