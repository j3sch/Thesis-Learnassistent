import { Hono } from 'hono'
import { OpenAIStream, StreamingTextResponse, streamText } from 'ai'
import OpenAI from 'openai'

type SseBindings = {
    OPENAI_API_KEY: string
}

export const assistantSse = new Hono<{ Bindings: SseBindings }>()
let openai: OpenAI

assistantSse.post('/', async (c) => {
    const { messages } = await c.req.json()
    console.log('first', messages)

    if (!openai) {
        openai = new OpenAI({
            apiKey: c.env.OPENAI_API_KEY || '',
        })
    }

    const res = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: messages,
    })

    return new StreamingTextResponse(OpenAIStream(res))
})
