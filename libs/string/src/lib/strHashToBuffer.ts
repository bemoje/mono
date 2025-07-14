import { createHash } from 'crypto'
import { TCryptoAlgorithm } from './TCryptoAlgorithm'

/**
 * Hash a string into a buffer with a given algorithm
 * @param string The string to hash
 * @param algorithm sha1 | sha256 | sha512 | md5 | etc...
 * @see crypto.getHashes for a list of accepted strings for 'algorithm'
 * @example ```ts
 * strHash.toBuffer('hello')
 * //=> <Buffer 2c f2 4d ba 5f b0 a3 0e 26 e8 3b 2a c5 b9 e2 9e 1b 16 1e 5c 1f a7 42 5e 73 04 33 62 93 8b 98 24>
 * ```
 */
export function strHashToBuffer(string: string, algorithm: TCryptoAlgorithm = 'sha256'): Buffer {
  return createHash(algorithm).update(string).digest()
}
