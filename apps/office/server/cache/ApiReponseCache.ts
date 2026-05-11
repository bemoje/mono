import { Level } from 'level'
import fs from 'fs-extra'
import objectHash from 'object-hash'

/**
 * Persistent API response cache based on level-db.
 */
export class ApiReponseCache<V> {
  /**
   * Level database instance
   */
  readonly db: Level<string, string>

  /**
   * Max age of cached data in milliseconds. Defaults to 0 (no max age).
   */
  readonly maxAgeMs: number

  /**
   * The directory path where the cache is stored.
   */
  readonly dirpath: string

  /**
   * Create a new instance.
   * @param options - Options for creating a new instance.
   */
  constructor(options: {
    /**
     * Path to cache directory. Defaults to a directory named 'ApiReponseCache' in the logged in user's app data directory.
     */
    dirpath: string

    /**
     * Max age of cached data in milliseconds. Defaults to 0 (no max age).
     */
    maxAgeMs: number
  }) {
    const { dirpath, maxAgeMs } = options
    this.maxAgeMs = maxAgeMs
    fs.mkdirSync(dirpath, { recursive: true })
    this.dirpath = dirpath
    this.db = new Level(dirpath)
    Object.defineProperty(this, 'db', { enumerable: false })
    void this.clearExpired().catch((err) => {
      console.error('Failed to clear expired cache data on initialization', err)
    })
  }

  /**
   * Get a value for a given hash key if it exists.
   * If the does not exist, returns a value from the api by invoking the provided function and then stores that value in the cache.
   * @param key - The hash key.
   * @param apiRequest - function that returns a new value for a given key if it doesn't exist in the cache.
   */
  async getOrElse(key: unknown, apiRequest: () => V | Promise<V>): Promise<V> {
    let value = await this.get(key)
    if (value === undefined) {
      value = await apiRequest()
      await this.set(key, value)
    }
    return value
  }

  /**
   * Get a value for a given hash key.
   * @param key: unknown - The hash key.
   */
  async getUnsafe(key: unknown): Promise<V> {
    const hash = this.hashKey(key)
    const serialized = await this.db.get(hash)
    const isExpired = await this.deleteIfExpired(hash, serialized)
    if (isExpired) throw new Error('Expired')
    const value = this.parseSerializedValue(serialized)
    return value
  }

  /**
   * Get a value for a given hash key or undefined if it does not exist or an error occurs.
   * @param key - The hash key.
   */
  async get(key: unknown): Promise<V | undefined> {
    try {
      return await this.getUnsafe(key)
    } catch (_) {
      return undefined
    }
  }

  /**
   * Returns whether a value exists for a given key.
   * @param key - The hash key.
   */
  async has(key: unknown): Promise<boolean> {
    try {
      await this.db.get(this.hashKey(key))
      return true
    } catch (_) {
      return false
    }
  }

  /**
   * Set a given value for a given hash key.
   * @param key - The hash key.
   * @param value - The value to store.
   */
  async set(key: unknown, value: V): Promise<void> {
    const serialized = this.serializeValue(value)
    await this.db.put(this.hashKey(key), serialized)
  }

  /**
   * Delete a given value for a given hash key if it exists.
   * @remarks No error is thrown if no value exists for the given hash.
   * @param key - The hash key.
   */
  async delete(key: unknown): Promise<void> {
    await this.db.del(this.hashKey(key))
  }

  /**
   * Delete all expired data.
   */
  async clearExpired(): Promise<void> {
    for await (const [hash, serialized] of this.db.iterator()) {
      await this.deleteIfExpired(hash, serialized)
    }
  }

  /**
   * Delete all cached API responses.
   */
  async clear(): Promise<void> {
    await this.db.clear()
  }

  /**
   * Iterate over all [key, value] pairs in the cache.
   * @remarks This data entries are expired, they are deleted and not yielded.
   */
  async *entries(): AsyncIterableIterator<[string, V]> {
    for await (const [hash, serialized] of this.db.iterator()) {
      await this.deleteIfExpired(hash, serialized)
      yield [hash, this.parseSerializedValue(serialized)]
    }
  }

  /**
   * Iterate over all keys in the cache.
   */
  async *keys(): AsyncIterableIterator<string> {
    for await (const [hash] of this.entries()) {
      yield hash
    }
  }

  /**
   * Iterate over all values in the cache.
   */
  async *values(): AsyncIterableIterator<V> {
    for await (const entry of this.entries()) {
      yield entry[1]
    }
  }

  /**
   * Get the number of entries in the cache.
   */
  async size(): Promise<number> {
    let size = 0

    for await (const _ of this.entries()) {
      size++
    }
    return size
  }

  /**
   * Hash any type of key to a base64 string, using the SHA1 algorithm.
   * @param key - The key to hash.
   */
  hashKey(key: unknown): string {
    return objectHash({ key }, { algorithm: 'sha1', encoding: 'base64' })
  }

  /**
   * Deletes a value from the cache if it is expired.
   * @param hash - The hash key.
   * @param serialized - The serialized value.
   */
  protected async ensureNotExpired(hash: string, serialized: string): Promise<void> {
    if (this.isExpired(serialized)) {
      await this.db.del(hash)
      throw new Error('Expired')
    }
  }

  /**
   * Check if a still raw serialized value string is expired.
   * @param serialized - The serialized value.
   */
  protected isExpired(serialized: string): boolean {
    if (!this.maxAgeMs) return false
    return Date.now() - this.parseSerializedTimestamp(serialized) > this.maxAgeMs
  }

  /**
   * Deletes an entry if it is expired. Returns whether the entry was expired or not.
   */
  protected async deleteIfExpired(hash: string, serialized: string): Promise<boolean> {
    if (this.isExpired(serialized)) {
      await this.db.del(hash)
      return true
    }
    return false
  }

  /**
   * Custom JSON stringify function that prepends a timestamp to the stringified object.
   * @param value - The value to serialize.
   */
  protected serializeValue(value: V): string {
    return Date.now() + JSON.stringify(value)
  }

  /**
   * Parse the timestamp part of a raw serialized value string from the database.
   * @param serialized - The serialized value.
   */
  protected parseSerializedTimestamp(serialized: string): number {
    return parseInt(serialized.substring(0, 13))
  }

  /**
   * Parse the json part of a raw serialized value string from the database.
   * @param serialized - The serialized value.
   */
  protected parseSerializedValue(serialized: string): V {
    return JSON.parse(serialized.substring(13))
  }
}
