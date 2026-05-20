If you only have a few fixed companies, you would explicitly define them exactly like this:

```typescript
import { integer, text } from 'drizzle-orm/pg-core'
import { pgSchema } from 'drizzle-orm/pg-core'

// 1. Define the schemas (namespaces) with their string names
export const companyA = pgSchema('company_a')
export const companyB = pgSchema('company_b')

// 2. Define the tables inside those specific schemas
export const companyA_users = companyA.table('users', {
  id: integer().primaryKey(),
  name: text(),
})

export const companyB_users = companyB.table('users', {
  id: integer().primaryKey(),
  name: text(),
})
```

Then, when Drizzle generates the migration, it will literally output:

```sql
CREATE SCHEMA "company_a";
CREATE SCHEMA "company_b";
CREATE TABLE "company_a"."users" (...);
CREATE TABLE "company_b"."users" (...);
```

### However, how do you do this dynamically for 10,000 customers?

If you are building a true Multi-Tenant SaaS app, you **do not** manually type out 10,000 `pgSchema` definitions in your TypeScript code.

Instead, you write your schema structure _once_ just using a normal `pgTable`, and then you dynamically switch the **PostgreSQL Search Path** at query time depending on who is logged in.

PostgreSQL has a feature called `search_path`. It tells the database which schema to look in by default when you just ask for the `users` table.

```typescript
// 1. You just define the structure ONCE as a normal table
export const users = pgTable('users', {
  id: integer().primaryKey(),
  name: text(),
})
```

Then, in your Express/Hono router, when a user makes a request, you extract their company ID from their JWT token and tell the database connection to switch to their specific schema folder before running the query:

```typescript
app.get('/users', async (c) => {
  // 1. Find out which company is calling the API
  const tenantName = c.req.header('x-tenant-id') // e.g. "company_a"

  // 2. Wrap your query in a transaction
  await db.transaction(async (tx) => {
    // 3. Switch the "folder" for this specific transaction
    await tx.execute(sql`SET search_path TO ${sql.identifier(tenantName)}`)

    // 4. Query the generic "users" table.
    // Because we changed the search path, Postgres will automatically
    // redirect this to "company_a.users" under the hood!
    const myUsers = await tx.select().from(users)

    return c.json(myUsers)
  })
})
```

This way, your TypeScript schema stays tiny and clean, but your database dynamically walls off all your customers' data into separate schemas!

Since you are using **Hono** for your backend, setting up JWT auth is extremely simple because Hono has JWT support built right into the framework!

Here is the step-by-step process of how JWT authentication flows and how you implement it in your current Hono/Vue stack.

### 1. The Login Route (Issuing the Token)

When a user logs in with their credentials, you verify them and construct a JSON object (the "payload") containing their user ID and their tenant ID. You then cryptographically sign this object using a secret key.

```typescript
// server/routes/auth.ts
import { Hono } from 'hono'
import { sign } from 'hono/jwt'

export const authRouter = new Hono()
const JWT_SECRET = 'your-super-secret-key-from-env'

authRouter.post('/login', async (c) => {
  const { expectedUsername, password } = await c.req.json()

  // 1. Verify password against database here...
  if (password === 'correct-password') {
    // 2. Create the JWT payload
    const payload = {
      sub: 'user_123', // Subject (User ID)
      tenant: 'company_a', // Your Multi-tenant ID!
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
    }

    // 3. Sign the token
    const token = await sign(payload, JWT_SECRET)

    return c.json({ token, message: 'Logged in!' })
  }

  return c.text('Unauthorized', 401)
})
```

### 2. Protecting Routes (Validating the Token)

For any routes that require the user to be logged in, you add Hono's `jwt` middleware. This middleware automatically looks for the `Authorization: Bearer <token>` header, verifies the cryptographic signature, and rejects the request if it's invalid or expired.

```typescript
// server/index.ts
import { jwt } from 'hono/jwt'

// ... auth router setup ...

// Protect all routes under /api/protected
app.use('/api/protected/*', jwt({ secret: JWT_SECRET }))

app.get('/api/protected/data', (c) => {
  // If the code reaches here, the token was 100% valid!

  // Hono automatically decoded the token and placed the payload here:
  const payload = c.get('jwtPayload')

  const tenantId = payload.tenant // "company_a"

  // Now you can do your tenant-specific Drizzle query!
  return c.json({ message: `Fetching data for ${tenantId}` })
})
```

### 3. The Frontend (Using the Token)

In your Vue app, when the user logs in, you save that token to `localStorage` (or a Pinia store). Then, you attach it to the headers of every subsequent API request.

Since you are using `hono/client` (RPC), you can pass the headers directly into the fetcher:

```typescript
// client/src/api/client.ts
import { hc } from 'hono/client'
import type { AppType } from '../../../server/index'

export const apiClient = hc<AppType>('/', {
  headers: () => {
    // Grab the token from localStorage
    const token = localStorage.getItem('jwt_token')

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      }
    }
    return {}
  },
})
```

### Summary of the Flow:

1. **Frontend**: Sends username/password to `/login`.
2. **Backend**: Validates, signs `{ tenant: 'company_a' }` into a scrambled string (`eyJhbG...`), and sends it back.
3. **Frontend**: Saves it to `localStorage` and attaches `Authorization: Bearer eyJhbG...` to all future requests.
4. **Backend Middleware**: Intercepts the request, unscrambles the string using your `JWT_SECRET`, and extracts the `tenant` to use in your Drizzle queries!
