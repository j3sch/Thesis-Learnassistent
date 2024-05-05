import { type inferAsyncReturnType } from '@trpc/server'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { createDb } from './db/client'
import { Context as HonoContext } from 'hono'
import { Bindings } from './worker'

interface ApiContextProps {
    db: DrizzleD1Database
    c: HonoContext<{
        Bindings: Bindings
    }>
}

export const createContext = async (
    d1: D1Database,
    c: HonoContext<{
        Bindings: Bindings
    }>
): Promise<ApiContextProps> => {
    const db = createDb(d1)

    return { db, c }
}

export type Context = inferAsyncReturnType<typeof createContext>
