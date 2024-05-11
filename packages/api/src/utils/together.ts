import { Context } from 'hono'
import OpenAI from 'openai'

let together: OpenAI

export function initTogether(c: Context) {
    if (!together) {
        together = new OpenAI({
            apiKey: c.env.TOGETHER_API_KEY,
            baseURL: 'https://api.together.xyz/v1',
        })
        return together
    }
    return together
}
