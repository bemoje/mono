import { Encoding } from 'crypto'
import { strHashToBuffer } from './strHashToBuffer'
import { TCryptoAlgorithm } from './TCryptoAlgorithm'

/**
 * Hash a string into a buffer with a given algorithm
 * @param string The string to hash
 * @param algorithm sha1 | sha256 | sha512 | md5 | etc...
 * @see crypto.getHashes for a list of accepted strings for 'algorithm'
 * @param encoding base64 | base64url | hex | binary | utf8 | utf-8 | utf16le | latin1 | ascii | binary | ucs2 | ucs-2
 * @example ```ts
 * strHash.toString('hello', 'sha256', 'hex')
 * //=> 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
 * ```
 */
export function strHashToString(
  string: string,
  algorithm: TCryptoAlgorithm = 'sha256',
  encoding: Encoding = 'base64',
): string {
  return strHashToBuffer(string, algorithm).toString(encoding)
}
