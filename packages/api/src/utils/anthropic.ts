import { createAnthropic, AnthropicProvider } from '@ai-sdk/anthropic'
import { Context } from 'hono'

let anthropic: AnthropicProvider

export function initAnthropic(c: Context) {
  if (!anthropic) {
    anthropic = createAnthropic({
      apiKey: c.env.ANTHROPIC_API_KEY,
    })
    return anthropic
  }
  return anthropic
}
