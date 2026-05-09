<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useSkryv } from './useSkryv'

const { state, messages, relayedBlobs, error, createRoom, joinRoom, sendMessage, disconnect } = useSkryv()

const passphrase = ref('')
const joinRoomId = ref('')
const joinSalt = ref('')
const msgInput = ref('')
const showDebug = ref(false)

// Room info returned when creating
const createdRoomId = ref('')
const createdSalt = ref('')

async function handleCreate() {
  if (!passphrase.value.trim()) return
  const info = await createRoom(passphrase.value)
  if (info) {
    createdRoomId.value = info.roomId
    createdSalt.value = info.salt
  }
}

async function handleJoin() {
  if (!passphrase.value.trim() || !joinRoomId.value.trim() || !joinSalt.value.trim()) return
  await joinRoom(passphrase.value, joinRoomId.value.trim(), joinSalt.value.trim())
}

async function handleSend() {
  if (!msgInput.value.trim()) return
  await sendMessage(msgInput.value)
  msgInput.value = ''
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + '...' : s
}
</script>

<template>
  <div class="app">
    <header>
      <h1>Office</h1>
      <p class="subtitle">End-to-end encrypted messaging. The server sees nothing.</p>
      <span class="state-badge" :class="state">{{ state }}</span>
    </header>

    <!-- Error -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Phase: Disconnected - Setup -->
    <section v-if="state === 'disconnected'" class="setup">
      <div class="field">
        <label>Passphrase <small>(exchanged physically)</small></label>
        <input v-model="passphrase" type="password" placeholder="correct horse battery staple" />
      </div>

      <div class="actions">
        <div class="action-group">
          <h3>Create a room</h3>
          <button @click="handleCreate" :disabled="!passphrase.trim()">Create Room</button>
        </div>

        <div class="divider">or</div>

        <div class="action-group">
          <h3>Join a room</h3>
          <div class="field">
            <label>Room ID</label>
            <input v-model="joinRoomId" placeholder="from your peer" />
          </div>
          <div class="field">
            <label>Salt</label>
            <input v-model="joinSalt" placeholder="from your peer" />
          </div>
          <button @click="handleJoin" :disabled="!passphrase.trim() || !joinRoomId.trim() || !joinSalt.trim()">
            Join Room
          </button>
        </div>
      </div>
    </section>

    <!-- Phase: Waiting for peer -->
    <section v-if="state === 'waiting'" class="waiting">
      <p>Room created. Share these with your peer (in person!):</p>
      <div class="share-info">
        <div class="field">
          <label>Room ID</label>
          <code>{{ createdRoomId }}</code>
        </div>
        <div class="field">
          <label>Salt</label>
          <code>{{ createdSalt }}</code>
        </div>
      </div>
      <p class="hint">Waiting for peer to join...</p>
      <button @click="disconnect">Cancel</button>
    </section>

    <!-- Phase: Key exchange -->
    <section v-if="state === 'connecting' || state === 'key-exchange'" class="exchanging">
      <p>Establishing secure channel...</p>
    </section>

    <!-- Phase: Ready - Chat -->
    <section v-if="state === 'ready'" class="chat">
      <div class="messages">
        <div v-for="(msg, i) in messages" :key="i" class="message" :class="msg.from">
          <span class="bubble">{{ msg.text }}</span>
        </div>
        <div v-if="messages.length === 0" class="empty">Secure channel established. Say something!</div>
      </div>
      <form class="input-row" @submit.prevent="handleSend">
        <input v-model="msgInput" placeholder="Type a message..." autofocus />
        <button type="submit" :disabled="!msgInput.trim()">Send</button>
      </form>
      <div class="chat-actions">
        <button class="secondary" @click="showDebug = !showDebug">
          {{ showDebug ? 'Hide' : 'Show' }} Server View
        </button>
        <button class="danger" @click="disconnect">Disconnect</button>
      </div>
    </section>

    <!-- Debug: What the server sees -->
    <section v-if="showDebug && relayedBlobs.length > 0" class="debug">
      <h3>What the server sees (opaque ciphertext)</h3>
      <div v-for="(blob, i) in relayedBlobs" :key="i" class="blob" :class="blob.direction">
        <span class="dir">{{ blob.direction === 'sent' ? 'YOU ->' : '<- PEER' }}</span>
        <code>{{ truncate(blob.ciphertext, 80) }}</code>
      </div>
    </section>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  color: #e0e0e0;
}
header {
  text-align: center;
  margin-bottom: 2rem;
}
header h1 {
  font-size: 2rem;
  margin: 0;
}
.subtitle {
  color: #888;
  font-size: 0.9rem;
}
.state-badge {
  display: inline-block;
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}
.state-badge.disconnected {
  background: #444;
}
.state-badge.connecting,
.state-badge.key-exchange {
  background: #7c5c00;
}
.state-badge.waiting {
  background: #1a4a6e;
}
.state-badge.ready {
  background: #1a5e2a;
}

.error {
  background: #5a1a1a;
  border: 1px solid #a33;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}
.field {
  margin-bottom: 0.8rem;
}
.field label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  color: #aaa;
}
.field small {
  color: #777;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 4px;
  background: #2a2a2a;
  color: #e0e0e0;
  font-size: 1rem;
  box-sizing: border-box;
}
button {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  background: #3a7bd5;
  color: white;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
button.secondary {
  background: #555;
}
button.danger {
  background: #a33;
}

.actions {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}
.action-group {
  flex: 1;
}
.divider {
  padding-top: 2rem;
  color: #666;
  font-style: italic;
}

.share-info {
  background: #1a1a2e;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
}
.share-info code {
  display: block;
  word-break: break-all;
  font-size: 0.85rem;
  color: #7ec8e3;
}
.hint {
  color: #888;
  font-style: italic;
}

.messages {
  border: 1px solid #333;
  border-radius: 6px;
  padding: 1rem;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 0.8rem;
  background: #1a1a1a;
}
.message {
  margin-bottom: 0.5rem;
}
.message.me {
  text-align: right;
}
.message.peer {
  text-align: left;
}
.bubble {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  max-width: 80%;
  word-break: break-word;
}
.message.me .bubble {
  background: #1a5e2a;
}
.message.peer .bubble {
  background: #333;
}
.empty {
  color: #666;
  text-align: center;
  padding: 2rem 0;
}

.input-row {
  display: flex;
  gap: 0.5rem;
}
.input-row input {
  flex: 1;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
  justify-content: flex-end;
}

.debug {
  margin-top: 1.5rem;
  border: 1px solid #555;
  border-radius: 6px;
  padding: 1rem;
  background: #111;
}
.debug h3 {
  margin-top: 0;
  color: #e8a;
  font-size: 0.9rem;
}
.blob {
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
}
.blob code {
  color: #999;
  word-break: break-all;
}
.dir {
  font-weight: 600;
  margin-right: 0.5rem;
}
.blob.sent .dir {
  color: #5a5;
}
.blob.received .dir {
  color: #55a;
}
</style>
