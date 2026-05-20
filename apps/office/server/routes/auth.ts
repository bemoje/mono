// server/routes/auth.ts
import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import z from 'zod'
import { zValidator } from '@hono/zod-validator'

export const authRouter = new Hono()
const JWT_SECRET = 'your-super-secret-key-from-env'

authRouter.post(
  '/login',
  zValidator(
    'json',
    z.object({
      tenant: z.string().default(process.env.NODE_ENV || 'dev'),
      username: z.string(),
      password: z.string(),
    })
  ),
  async (c) => {
    const { password } = c.req.valid('json')

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
  }
)

// // Protect all routes under /api/protected
// app.use('/api/protected/*', jwt({ secret: JWT_SECRET }))

// app.get('/api/protected/data', (c) => {
//   // If the code reaches here, the token was 100% valid!

//   // Hono automatically decoded the token and placed the payload here:
//   const payload = c.get('jwtPayload')

//   const tenantId = payload.tenant // "company_a"

//   // Now you can do your tenant-specific Drizzle query!
//   return c.json({ message: `Fetching data for ${tenantId}` })
// })
