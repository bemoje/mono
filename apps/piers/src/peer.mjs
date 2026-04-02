import * as naclUtil from 'tweetnacl-util'
import SimplePeer from 'simple-peer'
import WebSocket from 'ws' // still works in Bun
import nacl from 'tweetnacl'
import qrcode from 'qrcode-terminal'

// Generate key pair
const myKeyPair = nacl.box.keyPair()
console.log('Your public key (share via QR or manually):')
qrcode.generate(Buffer.from(myKeyPair.publicKey).toString('hex'), { small: true })

// Connect to relay
const relay = new WebSocket('ws://localhost:8080')

// Placeholder for other peer
let otherPubKey = null
let sharedKey = null
let peer = null

function setupPeer(initiator) {
  peer = new SimplePeer({ initiator })

  peer.on('signal', (signalData) => {
    relay.send(JSON.stringify({ signal: signalData }))
  })

  peer.on('connect', () => {
    console.log('Peer-to-peer connected! Messages are now direct.')
    process.stdin.on('data', (input) => {
      if (!sharedKey) return
      const nonce = nacl.randomBytes(24)
      const messageUint8 = naclUtil.decodeUTF8(input.toString().trim())
      const box = nacl.box.after(messageUint8, nonce, sharedKey)
      const payload = {
        nonce: Array.from(nonce),
        box: Array.from(box),
      }
      peer.send(JSON.stringify(payload))
    })
  })

  peer.on('data', (data) => {
    try {
      const payload = JSON.parse(data.toString())
      if (!sharedKey) return
      const decrypted = nacl.box.open.after(new Uint8Array(payload.box), new Uint8Array(payload.nonce), sharedKey)
      if (decrypted) {
        console.log('Peer:', naclUtil.encodeUTF8(decrypted))
      }
    } catch (e) {
      console.log('Received non-encrypted data or shared key not set yet.')
    }
  })
}

relay.on('open', () => {
  return console.log('Connected to relay.')
})

relay.on('message', (msg) => {
  const data = JSON.parse(msg.toString())

  if (!peer) {
    // First signal received, we are the responder
    setupPeer(false)
  }

  peer.signal(data.signal)
})

// Wait for user to paste other peer's public key
process.stdin.on('data', (data) => {
  if (!otherPubKey) {
    otherPubKey = Buffer.from(data.toString().trim(), 'hex')
    sharedKey = nacl.box.before(otherPubKey, myKeyPair.secretKey)
    console.log('Shared key computed. You can now type messages.')
    // If we are the initiator
    if (!peer) setupPeer(true)
  }
})
