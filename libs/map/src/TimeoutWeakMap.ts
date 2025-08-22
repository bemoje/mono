/**
 * A WeakMap with automatic timeout-based expiry for entries.
 *
 * Entries are automatically removed after a specified timeout period.
 * Accessing an entry refreshes its timeout, extending its lifetime.
 * This is useful for caching scenarios where you want automatic cleanup
 * of unused entries while keeping frequently accessed ones alive.
 */
export class TimeoutWeakMap<K extends object, V> {
  protected readonly wmap = new WeakMap<K, [V, NodeJS.Timeout]>()

  /**
   * @param timeoutMs Default timeout in milliseconds for entries
   */
  constructor(readonly timeoutMs: number) {}

  /**
   * Retrieves the value for the given key and refreshes its timeout.
   *
   * @param key The key to retrieve
   * @returns The value if found, undefined otherwise
   */
  get(key: K): V | undefined {
    const vt: [V, NodeJS.Timeout] | undefined = this.wmap.get(key)
    if (!vt) return undefined
    const [value, timeout] = vt
    timeout.refresh()
    return value
  }

  /**
   * Sets a key-value pair with an optional custom timeout.
   *
   * @param key The key to set
   * @param value The value to associate with the key
   * @param timeoutMs Optional timeout override for this entry
   * @returns This instance for chaining
   */
  set(key: K, value: V, timeoutMs?: number): this {
    this.wmap.set(key, [
      value,
      setTimeout(() => {
        this.delete(key)
      }, timeoutMs ?? this.timeoutMs).unref(),
    ])
    return this
  }

  /**
   * Removes a key-value pair and clears its timeout.
   *
   * @param key The key to delete
   * @returns True if the key existed and was deleted, false otherwise
   */
  delete(key: K): boolean {
    const vt: [V, NodeJS.Timeout] | undefined = this.wmap.get(key)
    if (!vt) return false
    const timeout = vt[1]
    clearTimeout(timeout)
    return this.wmap.delete(key)
  }

  /**
   * Checks if a key exists in the map.
   * Does not refresh the timeout.
   *
   * @param key The key to check
   * @returns True if the key exists, false otherwise
   */
  has(key: K): boolean {
    return this.wmap.has(key)
  }

  /**
   * Loads multiple key-value pairs into the map.
   *
   * @param entries Iterable of key-value pairs to load
   * @param timeoutMs Optional timeout override for all entries
   * @returns This instance for chaining
   */
  load(entries: Iterable<[K, V]>, timeoutMs?: number): this {
    for (const [key, value] of entries) {
      this.set(key, value, timeoutMs)
    }
    return this
  }

  /**
   * Updates an existing value or creates a new one using an update function.
   *
   * @param key The key to update
   * @param update Function that receives the current value and returns the new value
   * @returns This instance for chaining
   */
  update(key: K, update: (value: V | undefined, key: K, map: this) => V): this {
    return this.set(key, update(this.get(key), key, this))
  }

  /**
   * Gets a value or creates it using a factory function if it doesn't exist.
   * Refreshes timeout if the value exists.
   *
   * @param key The key to get or create
   * @param factory Function to create the value if it doesn't exist
   * @param timeoutMs Optional timeout override for new entries
   * @returns The existing or newly created value
   */
  getOrDefault(key: K, factory: (key: K, map: this) => V, timeoutMs?: number): V {
    const vt: [V, NodeJS.Timeout] | undefined = this.wmap.get(key)
    if (vt) {
      const [value, timeout] = vt
      timeout.refresh()
      return value
    } else {
      const value = factory(key, this)
      this.set(key, value, timeoutMs)
      return value
    }
  }
}
