# @bemoje/crypto

Encryption, decryption, and string hashing utilities built on Node.js `crypto`.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**decrypt**](./src/decrypt.ts): Decrypts a string that was encrypted using encrypt(). Expects input in format: hexadecimal IV (32 chars) + encrypted data Uses PBKDF2 for key derivation with 100k iterations.
- [**encrypt**](./src/encrypt.ts): Encrypts a string using AES-256-CBC with a random IV. Uses PBKDF2 for key derivation with 100k iterations.
- [**strHashToBuffer**](./src/strHashToBuffer.ts): Hash a string into a buffer with a given algorithm
- [**strHashToString**](./src/strHashToString.ts): Hash a string into a buffer with a given algorithm
- [**strHashToStringDJB2**](./src/strHashToStringDJB2.ts): Hashes a string using the DJB2 algorithm, returning a numeric hash value.
- [**strHashToUint32Array**](./src/strHashToUint32Array.ts): Hash a string into an array of unsigned 32-bit integers.

<!-- EXPORTS_END -->

## Installation

```bash
npm install @bemoje/crypto
```

## Usage

### Encrypt & Decrypt

AES-256-CBC encryption with PBKDF2 key derivation:

```ts
import { encrypt, decrypt } from '@bemoje/crypto'

const secret = 'my-private-key'
const encrypted = encrypt(secret, 'Hello, World!')
// => '7f3a...c8b2' (hex string with IV prefix)

decrypt(secret, encrypted)
// => 'Hello, World!'
```

### String Hashing

```ts
import { strHashToString, strHashToBuffer, strHashToStringDJB2 } from '@bemoje/crypto'

// SHA-256 hash as hex string
strHashToString('hello', 'sha256', 'hex')
// => '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'

// SHA-256 hash as base64
strHashToString('hello', 'sha256', 'base64')
// => 'LPJNul+wow4m6DsqxbninhsWHowMvUarIdUoR...'

// Hash to Buffer for binary operations
const buf = strHashToBuffer('hello', 'sha256')

// Fast DJB2 hash (non-cryptographic)
strHashToStringDJB2('hello')
// => 261238937
```
