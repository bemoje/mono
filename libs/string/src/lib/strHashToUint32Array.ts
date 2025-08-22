import { strHashToBuffer } from './strHashToBuffer'
import { TCryptoAlgorithm } from './TCryptoAlgorithm'

/**
 * Hash a string into an array of unsigned 32-bit integers.
 * @param string The string to hash
 * @param algorithm sha1 | sha256 | sha512 | md5 | etc...
 * @param - The hashing algorithm to be used. Defaults to 'sha256'.
 * @throws Will throw an error if the hashing algorithm is not supported.
 * @see crypto.getHashes for a list of accepted strings for 'algorithm'
 * @example ```ts
 * strHash.toUint32Array('hello')
 * //=> Uint32Array(8) [3125670444,  245608543, 708569126, 2665658821, 1545475611, 1581426463, 1647510643, 613976979]
 * ```
 */
export function strHashToUint32Array(string: string, algorithm: TCryptoAlgorithm = 'sha256'): Uint32Array {
  return new Uint32Array(strHashToBuffer(string, algorithm).buffer)
}
