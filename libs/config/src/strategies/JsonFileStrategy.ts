import fs from 'fs-extra'
import { ConfigDataStrategy } from '../interfaces/ConfigDataStrategy'

/**
 * Strategy for loading and saving configuration data as JSON files.
 */
export class JsonFileStrategy<T> implements ConfigDataStrategy<T> {
  constructor(readonly filepath: string) {}

  load(): T | undefined {
    if (!fs.existsSync(this.filepath)) return undefined
    return fs.readJsonSync(this.filepath)
  }

  save(config: T): void {
    fs.outputJsonSync(this.filepath, config, { spaces: 2 })
  }
}
