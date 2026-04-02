import { Database } from 'bun:sqlite'
import dashboard from './public/dashboard.html'
import homepage from './public/index.html'
import { serve } from 'bun'

// Initialize database
const db = new Database('app.db')
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

const server = serve({
  routes: {
    // Frontend routes
    '/': homepage,
    '/dashboard': dashboard,

    // API routes
    '/api/users': {
      async GET() {
        const users = db.query('SELECT * FROM users').all()
        return Response.json(users)
      },

      async POST(req) {
        const { name, email } = await req.json()

        try {
          const result = db.query('INSERT INTO users (name, email) VALUES (?, ?) RETURNING *').get(name, email)

          return Response.json(result, { status: 201 })
        } catch (error) {
          return Response.json({ error: 'Email already exists' }, { status: 400 })
        }
      },
    },

    '/api/users/:id': {
      async GET(req) {
        const { id } = req.params
        const user = db.query('SELECT * FROM users WHERE id = ?').get(id)

        if (!user) {
          return Response.json({ error: 'User not found' }, { status: 404 })
        }

        return Response.json(user)
      },

      async DELETE(req) {
        const { id } = req.params
        const result = db.query('DELETE FROM users WHERE id = ?').run(id)

        if (result.changes === 0) {
          return Response.json({ error: 'User not found' }, { status: 404 })
        }

        return new Response(null, { status: 204 })
      },
    },

    // Health check endpoint
    '/api/health': {
      GET() {
        return Response.json({
          status: 'ok',
          timestamp: new Date().toISOString(),
        })
      },
    },
  },

  // Enable development mode
  development: {
    hmr: true,
    console: true,
  },

  // Fallback for unmatched routes
  fetch(req) {
    return new Response('Not Found', { status: 404 })
  },
})

console.log(`🚀 Server running on ${server.url}`)
