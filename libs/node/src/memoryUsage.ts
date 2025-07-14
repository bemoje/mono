import { bytesToMegabytes } from '@mono/number'
import { round } from '@mono/number'

/**
 * Returns the memory usage of the Node.js process with values converted from bytes to megabytes and rounded to the specified precision.
 * @param precision - The number of decimal places to which the memory usage values should be rounded.
 * @returns An object containing the memory usage of the Node.js process. The properties of the object are:
 * - rss: Resident Set Size - the portion of the process's memory held in RAM.
 * - heapTotal: Total size of the allocated heap.
 * - heapUsed: Actual memory used during the execution of the process.
 * - external: Memory used by C++ objects bound to JavaScript objects managed by V8.
 * - arrayBuffers: Memory used by ArrayBuffers and SharedArrayBuffers, including all Node.js Buffers.
 */
export function memoryUsage(precision = 2): NodeJS.MemoryUsage {
  const mem = process.memoryUsage()
  return {
    rss: round(bytesToMegabytes(mem.rss), precision),
    heapTotal: round(bytesToMegabytes(mem.heapTotal), precision),
    heapUsed: round(bytesToMegabytes(mem.heapUsed), precision),
    external: round(bytesToMegabytes(mem.external), precision),
    arrayBuffers: round(bytesToMegabytes(mem.arrayBuffers), precision),
  }
}
