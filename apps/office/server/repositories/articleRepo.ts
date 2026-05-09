import { db } from '../db'

export function getArticles() {
  return db.prepare('SELECT * FROM articles ORDER BY time DESC').all()
}
