import { Hono } from 'hono'
import { analyticsRouter } from './routes/analytics'
import { articlesRouter } from './routes/articles'
import { fileURLToPath } from 'url'
import path from 'path'
import { serve } from '@hono/node-server'
import { spawn } from 'child_process'
import { streamRouter } from './routes/stream'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const app = new Hono()

// Mount routes
const api = app
  .route('/api/articles', articlesRouter)
  .route('/api/analytics', analyticsRouter)
  .route('/api/stream', streamRouter)

export type AppType = typeof api

const port = 3001
console.log(`Server is running on port ${port}`)
serve({
  fetch: app.fetch,
  port,
})

// Spawn long-running scraper process
const scraperProcess = spawn('npx', ['tsx', 'server/scrape.ts'], {
  stdio: 'inherit',
  cwd: path.resolve(dirname, '..'),
  shell: true,
})
scraperProcess.on('error', (err) => {
  console.error('Failed to start scraper process:', err)
})
scraperProcess.on('exit', (code) => {
  console.log(`Scraper process exited with code ${code}`)
})
