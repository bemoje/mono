import crypto from 'crypto'

/**
 * Decrypts a string that was encrypted using encrypt().
 * Expects input in format: hexadecimal IV (32 chars) + encrypted data
 * Uses PBKDF2 for key derivation with 100k iterations.
 */
export function decrypt(privateKey: string, encrypted: string): string {
  const ivHex = encrypted.substring(0, 32)
  const data = encrypted.substring(32)
  const iv = Buffer.from(ivHex, 'hex')
  const key = crypto.pbkdf2Sync(privateKey, 'salt', 100000, 32, 'sha256')
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(data, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
