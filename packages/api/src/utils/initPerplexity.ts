import { OpenAIProvider, createOpenAI } from '@ai-sdk/openai'
import { Context } from 'hono'

let perplexity: OpenAIProvider

export function initPerplexity(c: Context) {
  if (!perplexity) {
    perplexity = createOpenAI({
      apiKey: c.env.PERPLEXITY_API_KEY ?? '',
      baseURL: 'https://api.perplexity.ai/',
    })
    return perplexity
  }
  return perplexity
}
