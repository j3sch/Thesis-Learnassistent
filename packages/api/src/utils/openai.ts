import { Context } from 'hono'
import { createOpenAI, OpenAIProvider } from '@ai-sdk/openai'

let openai: OpenAIProvider

export function initOpenAi(c: Context) {
  if (!openai) {
    openai = createOpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    })
    return openai
  }
  return openai
}
