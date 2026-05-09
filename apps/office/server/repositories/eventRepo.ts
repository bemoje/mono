import { db } from '../db'

export function insertEvent(event: string, url: string) {
  db.prepare('INSERT INTO user_events (event, url) VALUES (?, ?)').run(event, url)
}
