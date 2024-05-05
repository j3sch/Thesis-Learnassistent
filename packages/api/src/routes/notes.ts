import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1'
import { Context, Hono } from 'hono'
import { NoteTable } from '../db/schema'
import { CustomContext } from '@t4/types'
import OpenAI from 'openai'

export type Bindings = {
    DB: D1Database
    OPENAI_API_KEY: string
}

export const notes = new Hono<{ Bindings: Bindings }>()

notes.post('/', async (c: CustomContext) => {
    const { text } = await c.req.json()

    if (!text) {
        return c.text('Missing text', 400)
    }

    const db = c.get<DrizzleD1Database>('db')

    const results = await db.insert(NoteTable).values({ text }).returning()

    const record = results.length ? results[0] : null

    if (!record) {
        return c.text('Failed to create note', 500)
    }

    const openai = c.get<OpenAI>('openai')

    const { data } = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
        dimensions: 768,
    })

    const values = data[0].embedding

    if (!values) {
        return c.text('Failed to generate vector embedding', 500)
    }

    const { id } = record

    const inserted = await c.env.VECTORIZE_INDEX.upsert([
        {
            id: id.toString(),
            values,
        },
    ])

    return c.json({ id, text, inserted })
})

notes.get('/', async (c: CustomContext) => {
    const { text: question } = await c.req.json()

    const openai = c.get<OpenAI>('openai')
    const { data } = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: question,
        encoding_format: 'float',
        dimensions: 768,
    })
    const vectors = data[0].embedding

    const SIMILARITY_CUTOFF = 0.75
    const vectorQuery = await c.env.VECTORIZE_INDEX.query(vectors, { topK: 1 })
    const vecIds = vectorQuery.matches
        .filter((vec: VectorizeMatch) => vec.score > SIMILARITY_CUTOFF)
        .map((vec: VectorizeMatch) => vec.id)

    const db = c.get<DrizzleD1Database>('db')
    let notes: string[] = []
    if (vecIds.length) {
        const results = await db.select().from(NoteTable).all()
        if (results) notes = results.map((vec) => vec.text)
    }

    const contextMessage = notes.length ? `Context:\n${notes.map((note) => `- ${note}`).join('\n')}` : ''

    const systemPrompt =
        'Antworte immer basierend auf den gegeben Informationen, Unabhängig ob das wahr oder falsch ist. Wenn "Nothing provided" ist, dann Antworte keine Relevaten Informationen vorhanden. '

    const res = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        stream: false,
        temperature: 0.4,
        messages: [
            { role: 'system', content: systemPrompt },
            notes.length
                ? { role: 'assistant', content: contextMessage }
                : { role: 'assistant', content: 'Nothing provided' },
            { role: 'user', content: question },
        ],
    })

    const message = res.choices[0].message.content

    console.log(message)

    return c.text(message ?? 'No response from AI')
})
