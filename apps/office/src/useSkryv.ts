import type { ClientMessage } from './protocol'
import type { ServerMessage } from './protocol'
import { decrypt } from './crypto'
import { deriveBootstrapKey } from './crypto'
import { deriveHmacKey } from './crypto'
import { deriveSharedKey } from './crypto'
import { encrypt } from './crypto'
import { exportPublicKey } from './crypto'
import { generateKeyPair } from './crypto'
import { importPublicKey } from './crypto'
import { ref } from 'vue'
import { signData } from './crypto'
import { toBase64 } from './crypto'
import { verifySignature } from './crypto'

export interface ChatMessage {
  from: 'me' | 'peer'
  text: string
  timestamp: number
}

/** What the server relayed (opaque ciphertext) - for the debug view */
export interface RelayedBlob {
  direction: 'sent' | 'received'
  ciphertext: string
  timestamp: number
}

export type ConnectionState = 'disconnected' | 'connecting' | 'waiting' | 'key-exchange' | 'ready'

const WS_URL = 'ws://localhost:3100/ws'

export function useSkryv() {
  const state = ref<ConnectionState>('disconnected')
  const messages = ref<ChatMessage[]>([])
  const relayedBlobs = ref<RelayedBlob[]>([])
  const error = ref<string | null>(null)

  let ws: WebSocket | null = null
  let sharedKey: CryptoKey | null = null
  let keyPair: CryptoKeyPair | null = null
  let hmacKey: CryptoKey | null = null
  let bootstrapSalt: ArrayBuffer | null = null
  let passphrase = ''
  let isCreator = false

  function sendToServer(msg: ClientMessage) {
    ws?.send(JSON.stringify(msg))
  }

  async function handleRelay(payload: string) {
    // During key-exchange, payload is a signed public key
    if (state.value === 'key-exchange') {
      await handleKeyExchange(payload)
      return
    }

    // During ready state, payload is encrypted message
    if (state.value === 'ready' && sharedKey) {
      try {
        const plaintext = await decrypt(sharedKey, payload)
        messages.value.push({ from: 'peer', text: plaintext, timestamp: Date.now() })
      } catch {
        error.value = 'Failed to decrypt message. Wrong passphrase?'
      }
    }
  }

  async function handleKeyExchange(payload: string) {
    if (!keyPair || !hmacKey) {
      return
    }

    // Parse: { publicKey: base64, signature: base64, salt?: base64 }
    let data: { publicKey: string; signature: string; salt?: string }
    try {
      data = JSON.parse(payload)
    } catch {
      error.value = 'Invalid key exchange data'
      return
    }

    // If we're the joiner, the creator sends salt with their public key
    if (data.salt && !bootstrapSalt) {
      bootstrapSalt = Uint8Array.from(atob(data.salt), (c) => {
        return c.charCodeAt(0)
      }).buffer
      // Re-derive HMAC key with the received salt
      const newHmacKey = await deriveHmacKey(passphrase, bootstrapSalt)
      hmacKey = newHmacKey // eslint-disable-line require-atomic-updates
    }

    // Verify the public key signature
    const currentHmacKey = hmacKey
    const valid = await verifySignature(currentHmacKey, data.publicKey, data.signature)
    if (!valid) {
      error.value = 'Public key verification failed. Passphrase mismatch!'
      state.value = 'disconnected'
      ws?.close()
      return
    }

    // Import peer's public key and derive shared secret
    const peerPublicKey = await importPublicKey(data.publicKey)
    sharedKey = await deriveSharedKey(keyPair.privateKey, peerPublicKey)
    state.value = 'ready'
  }

  async function sendPublicKey() {
    if (!keyPair || !hmacKey || !bootstrapSalt) {
      return
    }
    const pubKeyB64 = await exportPublicKey(keyPair.publicKey)
    const signature = await signData(hmacKey, pubKeyB64)
    const envelope: Record<string, string> = { publicKey: pubKeyB64, signature }
    // Creator includes the salt so the joiner can derive the same HMAC key
    if (isCreator) {
      envelope.salt = toBase64(bootstrapSalt)
    }
    sendToServer({ type: 'relay', payload: JSON.stringify(envelope) })
  }

  function handleServerMessage(ev: MessageEvent) {
    const msg: ServerMessage = JSON.parse(ev.data)

    switch (msg.type) {
      case 'room-created': {
        state.value = 'waiting'
        break
      }

      case 'room-joined': {
        state.value = 'key-exchange'
        // Joiner sends their public key immediately
        void sendPublicKey()
        break
      }

      case 'peer-joined': {
        // Creator sees the peer joined, starts key exchange
        state.value = 'key-exchange'
        void sendPublicKey()
        break
      }

      case 'relay': {
        relayedBlobs.value.push({
          direction: 'received',
          ciphertext: msg.payload,
          timestamp: Date.now(),
        })
        void handleRelay(msg.payload)
        break
      }

      case 'peer-disconnected': {
        state.value = 'disconnected'
        sharedKey = null
        error.value = 'Peer disconnected'
        break
      }

      case 'error': {
        error.value = msg.message
        break
      }
    }
  }

  /**
   * Create a room and wait for a peer.
   * @param phrase - the shared passphrase (exchanged physically)
   */
  async function createRoom(phrase: string) {
    passphrase = phrase
    isCreator = true
    error.value = null
    messages.value = []
    relayedBlobs.value = []

    // Derive keys from passphrase
    const bootstrap = await deriveBootstrapKey(phrase)
    bootstrapSalt = bootstrap.salt
    hmacKey = await deriveHmacKey(phrase, bootstrapSalt)
    keyPair = await generateKeyPair()

    // Room ID is a hash of the passphrase + salt (anonymous, deterministic for the pair)
    const roomIdBuf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(phrase + toBase64(bootstrapSalt))
    )
    const roomId = toBase64(roomIdBuf).slice(0, 16)

    state.value = 'connecting'
    ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      return sendToServer({ type: 'create-room', roomId })
    }
    ws.onmessage = handleServerMessage
    ws.onclose = () => {
      if (state.value !== 'disconnected') {
        state.value = 'disconnected'
      }
    }

    return { roomId, salt: toBase64(bootstrapSalt) }
  }

  /**
   * Join an existing room.
   * @param phrase - the shared passphrase
   * @param saltB64 - the salt from the room creator (shown to them on screen)
   */
  async function joinRoom(phrase: string, roomId: string, saltB64: string) {
    passphrase = phrase
    isCreator = false
    error.value = null
    messages.value = []
    relayedBlobs.value = []

    bootstrapSalt = Uint8Array.from(atob(saltB64), (c) => {
      return c.charCodeAt(0)
    }).buffer
    hmacKey = await deriveHmacKey(phrase, bootstrapSalt)
    keyPair = await generateKeyPair()

    state.value = 'connecting'
    ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      return sendToServer({ type: 'join-room', roomId })
    }
    ws.onmessage = handleServerMessage
    ws.onclose = () => {
      if (state.value !== 'disconnected') {
        state.value = 'disconnected'
      }
    }
  }

  /** Send an encrypted message to the peer. */
  async function sendMessage(text: string) {
    if (!sharedKey || state.value !== 'ready') {
      return
    }
    const ciphertext = await encrypt(sharedKey, text)
    relayedBlobs.value.push({ direction: 'sent', ciphertext, timestamp: Date.now() })
    sendToServer({ type: 'relay', payload: ciphertext })
    messages.value.push({ from: 'me', text, timestamp: Date.now() })
  }

  function disconnect() {
    ws?.close()
    ws = null
    sharedKey = null
    keyPair = null
    hmacKey = null
    bootstrapSalt = null
    state.value = 'disconnected'
    error.value = null
  }

  return {
    state,
    messages,
    relayedBlobs,
    error,
    createRoom,
    joinRoom,
    sendMessage,
    disconnect,
  }
}
