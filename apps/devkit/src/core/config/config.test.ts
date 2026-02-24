import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { ConfigSchema } from "./config";
import { dataPath } from "./config";
import { configFile } from "./config";

describe('config', () => {
  it('should export ConfigSchema as a TypeBox schema', () => {
    expect(ConfigSchema).toBeDefined()
    expect(ConfigSchema.type).toBe('object')
    expect(ConfigSchema.properties).toHaveProperty('templates')
  })

  it('should export dataPath as a string path', () => {
    expect(typeof dataPath).toBe('string')
    expect(dataPath).toContain('devkit.config.json')
  })

  it('should export configFile as a ConfigFile instance', () => {
    expect(configFile).toBeDefined()
    expect(configFile).toHaveProperty('filepath')
    expect(configFile).toHaveProperty('load')
  })
})
