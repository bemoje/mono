import * as schema from '../common/schema'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { migrate } from 'drizzle-orm/pglite/migrator'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const officeDir = path.resolve(__dirname, '..')
const dbDir = path.join(officeDir, 'data')
const DB_FILEPATH = path.join(dbDir, 'dr_nyheder_pg')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}
export const pgliteDb = new PGlite('file://' + DB_FILEPATH)

export const db = drizzle(pgliteDb, { schema })

// Automatically run any pending migrations when the DB is initialized
await migrate(db, { migrationsFolder: path.join(__dirname, 'migrations') })
