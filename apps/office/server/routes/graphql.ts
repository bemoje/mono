import { Hono } from 'hono'
import { buildSchema } from 'drizzle-graphql'
import { createYoga } from 'graphql-yoga'
import { db } from '../db' // Pulls in the PGLite instance and your schema

// 1. Drizzle automatically generates the GraphQL schema and resolvers
// directly from your schema.ts tables and relations.
const { schema } = buildSchema(db)

// 2. Setup GraphQL Yoga server instance
const yoga = createYoga({
  schema,
  // Match the route prefix where we mount it in Hono
  graphqlEndpoint: '/api/graphql',
})

export const graphqlRouter = new Hono()
  // 3. Handle both GET (Interactive GraphiQL UI) and POST (GraphQL Queries) requests
  .all('*', (c) =>
    // Pass the raw Node/Fetch request from Hono seamlessly into Yoga
    yoga(c.req.raw)
  )
