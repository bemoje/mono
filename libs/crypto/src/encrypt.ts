import crypto from 'crypto'

/**
 * Encrypts a string using AES-256-CBC with a random IV.
 * Uses PBKDF2 for key derivation with 100k iterations.
 *
 * @returns Hex string containing IV (32 chars) followed by encrypted data
 */
export function encrypt(privateKey: string, data: string): string {
  const iv = crypto.randomBytes(16)
  const key = crypto.pbkdf2Sync(privateKey, 'salt', 100000, 32, 'sha256')
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + encrypted
}
