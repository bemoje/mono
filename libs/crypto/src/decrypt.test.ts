import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { decrypt } from './decrypt'
import { encrypt } from './encrypt'

describe(decrypt.name, () => {
  it('examples', () => {
    expect(() => {
      const message = 'Hello, World!'
      const key = 'secret-key-123'
      const encrypted = encrypt(key, message)
      const decrypted = decrypt(key, encrypted)
      assert.strictEqual(decrypted, message)
    }).not.toThrow()
  })

  it('should decrypt data encrypted with encrypt function', () => {
    const testCases = [
      'simple text',
      'text with spaces and symbols!@#$%',
      '你好，世界! 👋',
      '',
      'a'.repeat(1000), // long string
    ]

    for (const message of testCases) {
      const key = 'test-key-123'
      const encrypted = encrypt(key, message)
      expect(decrypt(key, encrypted)).toBe(message)
    }
  })

  it('should throw on incorrect key', () => {
    const message = 'secret message'
    const encrypted = encrypt('correct-key', message)
    expect(() => decrypt('wrong-key', encrypted)).toThrow()
  })

  it('should throw on malformed encrypted data', () => {
    const key = 'test-key'

    // Too short (IV requires 32 hex chars)
    expect(() => decrypt(key, '0'.repeat(31))).toThrow()

    // Invalid hex characters
    expect(() => decrypt(key, 'g'.repeat(32) + 'abcd')).toThrow()

    // Valid IV but invalid encrypted data
    expect(() => decrypt(key, '0'.repeat(32) + 'invalid-hex')).toThrow()

    // Empty string
    expect(() => decrypt(key, '')).toThrow()
  })

  it('should handle different key types', () => {
    const message = 'test message'
    const keys = ['short', 'very-long-key-with-many-characters', '123456789', 'key with spaces']

    for (const key of keys) {
      const encrypted = encrypt(key, message)
      expect(decrypt(key, encrypted)).toBe(message)
    }
  })
})
