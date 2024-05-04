import { Hono } from 'hono'
import { OpenAIStream, StreamingTextResponse, streamText } from 'ai'
import OpenAI from 'openai'

type SseBindings = {
    OPENAI_API_KEY: string
}

export const sse = new Hono<{ Bindings: SseBindings }>()
let openai: OpenAI

sse.post('/', async (c) => {
    const { messages } = await c.req.json()

    if (!openai) {
        openai = new OpenAI({
            apiKey: c.env.OPENAI_API_KEY || '',
        })
    }

    const res = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        stream: true,
        messages: messages,
    })

    return new StreamingTextResponse(OpenAIStream(res))
})
