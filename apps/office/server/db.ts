import Database from 'better-sqlite3'
import type { Database as IDatabase } from 'better-sqlite3'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

// Find the absolute root of the 'office' workspace folder
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const officeDir = path.resolve(__dirname, '..')
const dbDir = path.join(officeDir, 'data')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

export const db: IDatabase = new Database(path.join(dbDir, 'dr_nyheder.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    url TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    time INTEGER NOT NULL,
    category TEXT NOT NULL,
    heading TEXT NOT NULL,
    summary TEXT,
    oldHeading TEXT,
    hidden INTEGER DEFAULT 0,
    fetchedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    event TEXT NOT NULL,
    url TEXT NOT NULL
  );
`)

export default db
