import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { Context } from 'hono'

let client: SupabaseClient

export function initSupabase(c: Context) {
    const privateKey = c.env.SUPABASE_PRIVATE_KEY
    if (!privateKey) throw new Error('Expected env var SUPABASE_PRIVATE_KEY')

    const url = c.env.SUPABASE_URL
    if (!url) throw new Error('Expected env var SUPABASE_URL')

    if (!client) {
        client = createClient(url, privateKey)
        return client
    }
    return client
}
