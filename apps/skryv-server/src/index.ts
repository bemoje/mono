import type { ClientMessage } from './protocol.ts'
import type { ServerMessage } from './protocol.ts'
import type { ServerWebSocket } from 'bun'

/** Per-connection state attached to each WebSocket. */
export interface SocketData {
  roomId: string | null
}

/**
 * Map of roomId -> set of connected sockets.
 * A room has at most 2 peers (1:1 messaging for the PoC).
 */
const rooms = new Map<string, Set<ServerWebSocket<SocketData>>>()

function send(ws: ServerWebSocket<SocketData>, msg: ServerMessage) {
  ws.send(JSON.stringify(msg))
}

function relayToPeer(ws: ServerWebSocket<SocketData>, msg: ServerMessage) {
  const roomId = ws.data.roomId
  if (!roomId) {
    return
  }
  const room = rooms.get(roomId)
  if (!room) {
    return
  }
  for (const peer of room) {
    if (peer !== ws) {
      peer.send(JSON.stringify(msg))
    }
  }
}

const PORT = Number(process.env.PORT ?? 3100)

const server = Bun.serve<SocketData>({
  port: PORT,
  fetch(req, server) {
    // Upgrade HTTP -> WebSocket
    const url = new URL(req.url)
    if (url.pathname === '/ws') {
      const upgraded = server.upgrade(req, {
        data: { roomId: null } satisfies SocketData,
      })
      if (upgraded) {
        return
      }
      return new Response('WebSocket upgrade failed', { status: 400 })
    }
    // Health check
    if (url.pathname === '/health') {
      return new Response('ok')
    }
    return new Response('Not found', { status: 404 })
  },
  websocket: {
    open(_ws) {
      console.log('[server] connection opened')
    },
    message(ws, raw) {
      let msg: ClientMessage
      try {
        msg = JSON.parse(typeof raw === 'string' ? raw : new TextDecoder().decode(raw))
      } catch {
        send(ws, { type: 'error', message: 'invalid json' })
        return
      }

      switch (msg.type) {
        case 'create-room': {
          if (rooms.has(msg.roomId)) {
            send(ws, { type: 'error', message: 'room already exists' })
            return
          }
          const room = new Set<ServerWebSocket<SocketData>>()
          room.add(ws)
          rooms.set(msg.roomId, room)
          ws.data.roomId = msg.roomId
          send(ws, { type: 'room-created', roomId: msg.roomId })
          console.log(`[server] room created: ${msg.roomId}`)
          break
        }

        case 'join-room': {
          const room = rooms.get(msg.roomId)
          if (!room) {
            send(ws, { type: 'error', message: 'room not found' })
            return
          }
          if (room.size >= 2) {
            send(ws, { type: 'error', message: 'room full' })
            return
          }
          room.add(ws)
          ws.data.roomId = msg.roomId
          send(ws, { type: 'room-joined', roomId: msg.roomId })
          // Notify the existing peer
          for (const peer of room) {
            if (peer !== ws) {
              send(peer, { type: 'peer-joined' })
            }
          }
          console.log(`[server] peer joined room: ${msg.roomId}`)
          break
        }

        case 'relay': {
          // The server NEVER inspects payload. It's opaque ciphertext.
          console.log(`[server] relaying ${msg.payload.length} chars of opaque data`)
          relayToPeer(ws, { type: 'relay', payload: msg.payload })
          break
        }

        default: {
          send(ws, { type: 'error', message: 'unknown message type' })
        }
      }
    },
    close(ws) {
      const roomId = ws.data.roomId
      if (roomId) {
        const room = rooms.get(roomId)
        if (room) {
          room.delete(ws)
          // Notify remaining peer
          for (const peer of room) {
            send(peer, { type: 'peer-disconnected' })
          }
          if (room.size === 0) {
            rooms.delete(roomId)
            console.log(`[server] room destroyed: ${roomId}`)
          }
        }
      }
      console.log('[server] connection closed')
    },
  },
})

console.log(`[skryv-server] blind relay listening on ws://localhost:${server.port}/ws`)
