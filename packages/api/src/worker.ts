import { trpcServer } from '@hono/trpc-server'
import { createContext } from '@t4/api/src/context'
import { appRouter } from '@t4/api/src/router'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sse } from './routes/sse'

export type Bindings = {
    DB: D1Database
    JWT_VERIFICATION_KEY: string
    APP_URL: string
    OPENAI_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Setup CORS for the frontend
app.use('/:path{^(trpc|sse).*}', async (c, next) => {
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
        createContext: async (opts) => {
            return await createContext(c.env.DB, c.env.JWT_VERIFICATION_KEY, opts, c)
        },
    })(c, next)
})

app.route('/sse', sse)

export default app
