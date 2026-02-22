import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Middleware
app.use('/*', cors())

// Healthcheck
app.get('/', (c) => c.json({ status: 'ok', message: 'Ruthan API is running on Cloudflare WorkersEdge!' }))

// Placeholder for CJ Dropshipping Auth
app.get('/api/cj/auth', async (c) => {
  const cjApiKey = c.env.CJ_API_KEY
  // Simulate CJ API fetch logic using Cloudflare native fetch
  return c.json({ success: true, message: 'CJ Auth stubbed' })
})

// Database (Supabase) proxy example
app.get('/api/customers', async (c) => {
  const supabaseUrl = c.env.SUPABASE_URL
  const supabaseKey = c.env.SUPABASE_KEY
  return c.json({ data: [] })
})

export default app
