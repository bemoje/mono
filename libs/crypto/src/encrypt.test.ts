import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { encrypt } from './encrypt'
import { decrypt } from './decrypt'

describe(encrypt.name, () => {
  it('examples', () => {
    expect(() => {
      const message = 'Hello, World!'
      const key = 'secret-key-123'
      const encrypted = encrypt(key, message)
      assert.strictEqual(typeof encrypted, 'string')
      assert.strictEqual(encrypted.length > 32, true, 'encrypted string should contain IV + data')
      const decrypted = decrypt(key, encrypted)
      assert.strictEqual(decrypted, message)
    }).not.toThrow()
  })

  it('should encrypt differently each time due to random IV', () => {
    const message = 'test'
    const key = 'key123'
    const enc1 = encrypt(key, message)
    const enc2 = encrypt(key, message)
    expect(enc1).not.toBe(enc2)
    expect(decrypt(key, enc1)).toBe(message)
    expect(decrypt(key, enc2)).toBe(message)
  })

  it('should handle empty strings', () => {
    const key = 'key123'
    const encrypted = encrypt(key, '')
    expect(decrypt(key, encrypted)).toBe('')
  })

  it('should handle unicode strings', () => {
    const message = '你好，世界! 👋'
    const key = 'key123'
    const encrypted = encrypt(key, message)
    expect(decrypt(key, encrypted)).toBe(message)
  })

  it('should throw on incorrect key for decryption', () => {
    const message = 'secret'
    const encrypted = encrypt('key1', message)
    expect(() => decrypt('key2', encrypted)).toThrow()
  })

  it('should throw on malformed encrypted data', () => {
    expect(() => decrypt('key', 'not-valid-hex')).toThrow()
    expect(() => decrypt('key', '0'.repeat(32) + 'not-hex')).toThrow()
  })
})
