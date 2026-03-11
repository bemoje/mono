import type { ConfigDataStrategy } from '../interfaces/ConfigDataStrategy'
import fs from 'fs-extra'

/**
 * Strategy for loading and saving configuration data as JSON files.
 */
export class JsonFileStrategy<T> implements ConfigDataStrategy<T> {
  constructor(readonly filepath: string) {}

  load(): T | undefined {
    try {
      return fs.readJsonSync(this.filepath)
    } catch (_) {
      return undefined
    }
  }

  save(config: T): void {
    if (fs.existsSync(this.filepath)) {
      try {
        const current = fs.readJsonSync(this.filepath)
        if (JSON.stringify(current) === JSON.stringify(config)) {
          return
        }
      } catch (_) {
        //
      }
    }
    fs.outputFileSync(this.filepath, `${JSON.stringify(config, null, 2)}\n`)
  }
}
