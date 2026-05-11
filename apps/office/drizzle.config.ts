import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './common/schema.ts',
  out: './server/migrations',
  dialect: 'postgresql',
  driver: 'pglite',
  dbCredentials: {
    url: './data/dr_nyheder_pg',
  },
})
