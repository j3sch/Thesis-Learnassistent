import { Context } from 'hono'
import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai'

let together: OpenAIProvider

export function initTogether(c: Context) {
    if (!together) {
        together = createOpenAI({
            apiKey: c.env.TOGETHER_API_KEY,
            baseURL: 'https://api.together.xyz/v1',
        })
        return together
    }
    return together
}
