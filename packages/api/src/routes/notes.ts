import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1'
import { Context, Hono } from 'hono'
import { NoteTable } from '../db/schema'
import { CustomContext } from '@t4/types'
import type { VectorStore } from '@langchain/core/vectorstores'
import { Document } from '@langchain/core/documents'
import { CloudflareVectorizeStore, CloudflareWorkersAIEmbeddings } from '@langchain/cloudflare'
import { OpenAI, OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { pull } from 'langchain/hub'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { createConversationalRetrievalChain } from '../conversational_retrieval_chain'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains'
import { PromptTemplate } from '@langchain/core/prompts'
import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'

export type Bindings = {
    DB: D1Database
    OPENAI_API_KEY: string
    SEARCHAPI_API_KEY: string
    PINECONE_API_KEY: string
    PINECONE_INDEX: string
}

let aiKnowledgeVectorstore: CloudflareVectorizeStore

export const notes = new Hono<{ Bindings: Bindings }>()

const promptTemplate = `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Answer in German:`
const prompt = PromptTemplate.fromTemplate(promptTemplate)

const upsertDocsToVectorstore = async (vectorstore: VectorStore, docs: Document[]) => {
    const ids = []
    const encoder = new TextEncoder()
    for (const doc of docs) {
        // Vectorize does not support object metadata, and we won't be needing it for
        // this app.
        doc.metadata = {}
        const insecureHash = await crypto.subtle.digest('SHA-1', encoder.encode(doc.pageContent))
        // Use a hash of the page content as an id
        const hashArray = Array.from(new Uint8Array(insecureHash))
        const readableId = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
        ids.push(readableId)
    }
    const result = await vectorstore.addDocuments(docs, { ids })
    return result
}

notes.post('/', async (c: CustomContext) => {
    const loader = new CheerioWebBaseLoader('https://developers.cloudflare.com/workers-ai/models/', {
        selector: 'body',
    })

    // const docs = await loader.load()

    const embeddings = new OpenAIEmbeddings({
        apiKey: c.env.OPENAI_API_KEY,
        model: 'text-embedding-3-small',
        dimensions: 768,
    })

    // Tune based on your raw content.
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1024,
        chunkOverlap: 200,
    })

    // const splitAiAgentDocs = await splitter.splitDocuments(docs)

    aiKnowledgeVectorstore = new CloudflareVectorizeStore(embeddings, {
        index: c.env.VECTORIZE_INDEX,
    })

    const pinecone = new Pinecone({
        apiKey: c.env.PINECONE_API_KEY,
    })

    const pineconeIndex = pinecone.Index(c.env.PINECONE_INDEX)

    const docs = [
        new Document({
            metadata: { foo: 'bar' },
            pageContent: 'pinecone is a vector db',
        }),
        new Document({
            metadata: { foo: 'bar' },
            pageContent: 'the quick brown fox jumped over the lazy dog',
        }),
        new Document({
            metadata: { baz: 'qux' },
            pageContent: 'lorem ipsum dolor sit amet',
        }),
        new Document({
            metadata: { baz: 'qux' },
            pageContent: 'pinecones are the woody fruiting body and of a pine tree',
        }),
    ]

    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
    })

    return c.text('Success')

    // const db = c.get<DrizzleD1Database>('db')
    // const ids = []
    // for (const doc of splitAiAgentDocs) {
    //     const text = doc.pageContent
    //     const results = await db.insert(NoteTable).values({ text }).returning()
    //     const record = results.length ? results[0] : null
    //     if (!record) {
    //         return c.text('Failed to create note', 500)
    //     }
    //     const { id } = record
    //     ids.push(id)
    // }

    // await aiKnowledgeVectorstore.addDocuments(
    //     [
    //         {
    //             pageContent: 'der apfel ist lila',
    //             metadata: {},
    //         },
    //         {
    //             pageContent: 'morgen ist dienstag',
    //             metadata: {},
    //         },
    //         {
    //             pageContent: 'hi',
    //             metadata: {},
    //         },
    //     ],
    //     { ids: ['id1', 'id2', 'id3'] }
    // )

    const retriever = aiKnowledgeVectorstore.asRetriever()
    const llm = new ChatOpenAI({ model: 'gpt-4-turbo', temperature: 0, apiKey: c.env.OPENAI_API_KEY })

    // const chain = RetrievalQAChain.fromLLM(llm, retriever)

    const chain = new RetrievalQAChain({
        returnSourceDocuments: true,
        combineDocumentsChain: loadQAStuffChain(llm, { prompt }),
        retriever,
    })

    const res = await chain.invoke({
        query: 'Welche farbe hat der Apfel?',
    })

    console.log(JSON.stringify(res))

    console.log('yessss')

    // const r = await upsertDocsToVectorstore(aiKnowledgeVectorstore, splitAiAgentDocs)

    return c.text('Success')

    // Ingest content from a blog post on AI agents

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

    const inserted = await c.env.VECTORIZE_INDEX.upsert([
        {
            id: id.toString(),
            values,
        },
    ])

    return c.json({ id, text, inserted })
})

notes.get('/', async (c: CustomContext) => {
    // const { text: question } = await c.req.json()
    const currentMessage = { content: 'What is the Text Classification model?' }

    // const openai = c.get<OpenAI>('openai')
    console.log('0')

    const embeddings = new OpenAIEmbeddings({
        apiKey: c.env.OPENAI_API_KEY,
        model: 'text-embedding-3-small',
        dimensions: 768,
    })

    aiKnowledgeVectorstore = new CloudflareVectorizeStore(embeddings, {
        index: c.env.VECTORIZE_INDEX,
    })

    const retriever = aiKnowledgeVectorstore.asRetriever()
    const llm = new ChatOpenAI({ model: 'gpt-4-turbo', temperature: 0, apiKey: c.env.OPENAI_API_KEY })

    // const chain = RetrievalQAChain.fromLLM(llm, retriever)

    const chain = new RetrievalQAChain({
        returnSourceDocuments: true,
        combineDocumentsChain: loadQAStuffChain(llm, { prompt }),
        retriever,
    })

    const res = await chain.invoke({
        query: 'Welche farbe hat der Apfel?',
    })
    console.log(res.text)

    return c.text('Success')

    // const prompt = await pull<ChatPromptTemplate>('rlm/rag-prompt')
    // console.log('2')
    // console.log('3')

    // const result = await aiKnowledgeVectorstore.similaritySearch('What is the Text Classification model?', 5)

    // const matches = await aiKnowledgeVectorstore.similaritySearchWithScore('What is the Text Classification model?', 3)

    // console.log(JSON.stringify(matches))

    // const SIMILARITY_CUTOFF = 0.75
    // const vectorQuery = await c.env.VECTORIZE_INDEX.query(vectors, { topK: 1 })
    // const vecIds = vectorQuery.matches
    //     .filter((vec: VectorizeMatch) => vec.score > SIMILARITY_CUTOFF)
    //     .map((vec: VectorizeMatch) => vec.id)

    //     const chain = createConversationalRetrievalChain({
    //         model: llm,
    //         aiKnowledgeVectorstore,
    //     })

    //     console.log('4')

    //     const s = await chain.withConfig({ runName: 'ConversationalRetrievalChain' })

    //     console.log(s)

    //     let runIdResolver: (runId: string) => void
    //     const runIdPromise = new Promise<string>((resolve) => {
    //         runIdResolver = resolve
    //     })

    //     const stream = await chain.pipe(new HttpResponseOutputParser({ contentType: 'text/event-stream' })).stream(
    //         {
    //             question: currentMessage.content,
    //         },
    //         {
    //             callbacks: [
    //                 {
    //                     handleChainStart(_llm, _prompts, runId) {
    //                         runIdResolver(runId)
    //                     },
    //                 },
    //             ],
    //         }
    //     )

    //     const runId = await runIdPromise
    //     return new Response(stream, {
    //         headers: {
    //             'Content-Type': 'text/event-stream',
    //             'X-Langsmith-Run-Id': runId,
    //         },
    //     })
    // })

    // const ragChain = await createStuffDocumentsChain({
    //     llm,
    //     prompt,
    //     outputParser: new StringOutputParser(),
    // })
    // console.log('4')
    // const retrievedDocs = await retriever.getRelevantDocuments('What is the Text Classification model?')

    // console.log(JSON.stringify(retrievedDocs))

    // const result = await ragChain.invoke({
    //     question: 'What is the Text Classification model?',
    //     context: retrievedDocs,
    // })

    // console.log(result)
    // const { data } = await openai.embeddings.create({
    //     model: 'text-embedding-3-small',
    //     input: question,
    //     encoding_format: 'float',
    //     dimensions: 768,
    // })
    // const vectors = data[0].embedding

    // const SIMILARITY_CUTOFF = 0.75
    // const vectorQuery = await c.env.VECTORIZE_INDEX.query(vectors, { topK: 1 })
    // const vecIds = vectorQuery.matches
    //     .filter((vec: VectorizeMatch) => vec.score > SIMILARITY_CUTOFF)
    //     .map((vec: VectorizeMatch) => vec.id)

    // const db = c.get<DrizzleD1Database>('db')
    // let notes: string[] = []
    // if (vecIds.length) {
    //     const results = await db.select().from(NoteTable).all()
    //     if (results) notes = results.map((vec) => vec.text)
    // }

    // const contextMessage = notes.length ? `Context:\n${notes.map((note) => `- ${note}`).join('\n')}` : ''

    // const systemPrompt =
    //     'Antworte immer basierend auf den gegeben Informationen, Unabhängig ob das wahr oder falsch ist. Wenn "Nothing provided" ist, dann Antworte keine Relevaten Informationen vorhanden. '

    // const res = await openai.chat.completions.create({
    //     model: 'gpt-4-turbo',
    //     stream: false,
    //     temperature: 0.4,
    //     messages: [
    //         { role: 'system', content: systemPrompt },
    //         notes.length
    //             ? { role: 'assistant', content: contextMessage }
    //             : { role: 'assistant', content: 'Nothing provided' },
    //         { role: 'user', content: question },
    //     ],
    // })

    // const message = res.choices[0].message.content

    // console.log(message)

    return c.text('No response from AI')
    // return c.text(result ?? 'No response from AI')
})
