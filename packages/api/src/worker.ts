import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1'
import { trpcServer } from '@hono/trpc-server'
import { createContext } from '@t4/api/src/context'
import { appRouter } from '@t4/api/src/router'
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { notes } from './routes/notes'
import { createDb } from './db/client'
import OpenAI from 'openai'
import { CustomContext } from '@t4/types'
import { assistantSse } from './routes/assistant-sse'
import { exercise } from './routes/exercise'

export type Bindings = {
  DB: D1Database
  APP_URL: string
  OPENAI_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Setup CORS for the frontend
app.use('/:path{^(trpc|assistant-sse|notes|sse|exercise).*}', async (c, next) => {
  if (c.env.APP_URL === undefined) {
    console.log('APP_URL is not set. CORS errors may occur.')
  }
  return await cors({
    origin: (origin) => (origin.endsWith(new URL(c.env.APP_URL).host) ? origin : c.env.APP_URL),
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  })(c, next)
})

// Setup TRPC server with context
app.use('/trpc/*', async (c, next) => {
  return await trpcServer({
    router: appRouter,
    createContext: async () => {
      return await createContext(c.env.DB, c)
    },
  })(c, next)
})

app.route('/assistant-sse', assistantSse)

app.route('/notes', notes)

app.route('/exercise', exercise)

export default app
