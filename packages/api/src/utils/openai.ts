import { Context } from 'hono'
import OpenAI from 'openai'

let openai: OpenAI

export function initOpenAi(c: Context) {
    if (!openai) {
        openai = new OpenAI({
            apiKey: c.env.OPENAI_API_KEY,
        })
        return openai
    }
    return openai
}
