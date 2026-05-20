import { Hono } from 'hono'
import { buildSchema } from 'drizzle-graphql'
import { createYoga } from 'graphql-yoga'
import { db } from '../db' // Pulls in the PGLite instance and your schema
// import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations'

const { schema } = buildSchema(db)

// // Define your named queries/mutations here
// const queryStore: Record<string, string> = {
//   UpdateArticleDebaited: `
//     mutation ($articleId: Int!, $heading: String, $summary: String) {
//       updateArticles(
//         where: { id: { eq: $articleId } }
//         set: { debaitedHeading: $heading, debaitedSummary: $summary }
//       ) { id }
//     }
//   `,
//   GetArticles: `
//     query { articles { id title } }
//   `,
// }

// 2. Setup GraphQL Yoga server instance
const yoga = createYoga({
  schema,
  // Match the route prefix where we mount it in Hono
  graphqlEndpoint: '/api/graphql',

  // plugins: [
  // usePersistedOperations({
  //   // Look up the query string based on the name passed by the client
  //   getPersistedOperation(key: string) {
  //     return queryStore[key] || null
  //   },
  //   // Optional: Set to true if you ONLY want to allow these pre-defined queries (disables ad-hoc queries)
  //   // allowBatchedHttpRequests: true
  // }),
  // ],
})

// export const graphqlRouter = new Hono().all('*', (c) => yoga.handle(c.req.raw))

export const graphqlRouter = new Hono()
  // 3. Handle both GET (Interactive GraphiQL UI) and POST (GraphQL Queries) requests
  .all('*', (c) =>
    // Pass the raw Node/Fetch request from Hono seamlessly into Yoga
    yoga(c.req.raw)
  )
