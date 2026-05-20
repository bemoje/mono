/**
 * Client-side cryptography for Skryv.
 * Uses only the Web Crypto API - zero dependencies.
 *
 * Flow:
 * 1. Both users enter the same passphrase (exchanged physically).
 * 2. A bootstrap key is derived from the passphrase via PBKDF2.
 * 3. Each client generates an ephemeral ECDH key pair.
 * 4. Public keys are exchanged via the server, signed with HMAC using the bootstrap key.
 * 5. Each client derives a shared secret via ECDH.
 * 6. Messages are encrypted with AES-GCM using the shared secret.
 */
export function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

export function fromBase64(b64: string): ArrayBuffer {
  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buf[i] = bin.charCodeAt(i)
  }
  return buf.buffer
}

// --- PBKDF2: Passphrase -> Bootstrap Key ---

const PBKDF2_ITERATIONS = 600_000
const SALT_BYTES = 16

/** Derive a 256-bit key from a passphrase. Returns { key, salt }. */
export async function deriveBootstrapKey(
  passphrase: string,
  salt?: ArrayBuffer
): Promise<{ key: CryptoKey; salt: ArrayBuffer }> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, [
    'deriveBits',
    'deriveKey',
  ])
  const usedSalt = salt ?? crypto.getRandomValues(new Uint8Array(SALT_BYTES)).buffer
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: usedSalt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
  return { key, salt: usedSalt }
}

/** Derive an HMAC signing key from the same passphrase (different usage). */
export async function deriveHmacKey(passphrase: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, [
    'deriveBits',
    'deriveKey',
  ])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-512' },
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    false,
    ['sign', 'verify']
  )
}

// --- ECDH Key Pair ---

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key)
  return toBase64(raw)
}

export async function importPublicKey(b64: string): Promise<CryptoKey> {
  const raw = fromBase64(b64)
  return crypto.subtle.importKey('raw', raw, { name: 'ECDH', namedCurve: 'P-256' }, true, [])
}

// --- HMAC: Authenticate public key exchange ---

export async function signData(hmacKey: CryptoKey, data: string): Promise<string> {
  const enc = new TextEncoder()
  const sig = await crypto.subtle.sign('HMAC', hmacKey, enc.encode(data))
  return toBase64(sig)
}

export async function verifySignature(hmacKey: CryptoKey, data: string, signatureB64: string): Promise<boolean> {
  const enc = new TextEncoder()
  const sig = fromBase64(signatureB64)
  return crypto.subtle.verify('HMAC', hmacKey, sig, enc.encode(data))
}

// --- ECDH Shared Secret -> AES-GCM Key ---

export async function deriveSharedKey(privateKey: CryptoKey, peerPublicKey: CryptoKey): Promise<CryptoKey> {
  const sharedBits = await crypto.subtle.deriveBits({ name: 'ECDH', public: peerPublicKey }, privateKey, 256)
  return crypto.subtle.importKey('raw', sharedBits, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ])
}

// --- AES-GCM Encrypt / Decrypt ---

const IV_BYTES = 12

export async function encrypt(key: CryptoKey, plaintext: string): Promise<string> {
  const enc = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext))
  // Prepend IV to ciphertext, then base64 the whole thing
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.length)
  return toBase64(combined.buffer)
}

export async function decrypt(key: CryptoKey, b64: string): Promise<string> {
  const combined = new Uint8Array(fromBase64(b64))
  const iv = combined.slice(0, IV_BYTES)
  const ciphertext = combined.slice(IV_BYTES)
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return new TextDecoder().decode(plaintext)
}
