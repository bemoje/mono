/**
 * Get the current heap memory usage in megabytes.
 */
export function getCurrentMemoryUsage() {
  return process.memoryUsage().heapUsed / 1024 ** 2
}
