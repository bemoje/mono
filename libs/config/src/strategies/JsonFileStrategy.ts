import fs from 'fs-extra'
import { ConfigDataStrategy } from '../interfaces/ConfigDataStrategy'

/**
 * Strategy for loading and saving configuration data as JSON files.
 */
export class JsonFileStrategy<T> implements ConfigDataStrategy<T> {
  constructor(readonly filepath: string) {}

  load(): T | undefined {
    try {
      return fs.readJsonSync(this.filepath)
    } catch (error) {
      return undefined
    }
  }

  save(config: T): void {
    fs.outputFileSync(this.filepath, JSON.stringify(config, null, 2) + '\n')
  }
}
