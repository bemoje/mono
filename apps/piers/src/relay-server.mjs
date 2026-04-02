import { serve } from 'bun'

// Minimal WebSocket relay using Bun's built-in server
const clients = new Set()

serve({
  port: 8080,
  websocket: {
    open(ws) {
      clients.add(ws)
    },
    message(ws, message) {
      for (const client of clients) {
        if (client !== ws) {
          client.send(message)
        }
      }
    },
    close(ws) {
      clients.delete(ws)
    },
  },
})

console.log('Relay server running on ws://localhost:8080')
