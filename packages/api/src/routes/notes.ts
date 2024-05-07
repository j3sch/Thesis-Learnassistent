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
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright'
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf'
import cheerio from 'cheerio'
import { HtmlToTextTransformer } from '@langchain/community/document_transformers/html_to_text'

export type Bindings = {
    DB: D1Database
    OPENAI_API_KEY: string
    SEARCHAPI_API_KEY: string
    PINECONE_API_KEY: string
    PINECONE_INDEX: string
    PINECONE_ENVIRONMENT: string
    SUPABASE_PRIVATE_KEY: string
    SUPABASE_URL: string
}

let aiKnowledgeVectorstore: CloudflareVectorizeStore

export const notes = new Hono<{ Bindings: Bindings }>()

const promptTemplate = `Use the following pieces of context to answer the question at the end. If the information is not provided in the context, then just say that you don't know, don't try to make up an answer.

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
    const loader = new CheerioWebBaseLoader(
        'https://www.bpb.de/themen/politisches-system/deutsche-demokratie/39287/demokratie/',
        {
            selector: 'article',
        }
    )

    const docs = await loader.load()

    // console.log(JSON.stringify(docs))
    // console.log('-----------------------------------------------')

    const splitter = RecursiveCharacterTextSplitter.fromLanguage('html')
    const transformer = new HtmlToTextTransformer({
        chunkSize: 1024,
        chunkOverlap: 200,
    })

    const sequence = splitter.pipe(transformer)

    const newDocuments = await sequence.invoke(docs)

    console.log(newDocuments)

    // const s = new RecursiveCharacterTextSplitter({
    //     chunkSize: 1024,
    //     chunkOverlap: 200,
    // })

    // const sp = await s.splitText(docs)

    // console.log(JSON.stringify(sp))

    // const htmlContent = docs[0].pageContent

    // // Verwenden von Cheerio, um den HTML-Inhalt zu laden
    // const $ = cheerio.load(htmlContent)

    // // Entfernen von HTML-Elementen und Extrahieren des reinen Textinhalts
    // // Hier als Beispiel: Extrahieren des Textinhalts des Body-Elements
    // const pureContent = $('body').text()

    // // Angenommen, `pureContent` ist der mit Cheerio extrahierte Text
    // let bereinigterText = pureContent.replace(/\n/g, ' ').replace(/\r/g, ' ')

    // // Entfernen von zusätzlichen Leerzeichen, die durch das Entfernen der Zeilenumbrüche entstehen könnten
    // bereinigterText = bereinigterText.replace(/\s+/g, ' ').trim()

    // const body = await c.req.text()
    // console.log(body)
    // if (body.type === "text") {
    //   const text = await body.value;
    //   console.log(text); // Hier ist Ihr Textinhalt
    //   ctx.response.body = "Text erhalten";
    // }

    return c.text('Success')

    const embeddings = new OpenAIEmbeddings({
        apiKey: c.env.OPENAI_API_KEY,
        model: 'text-embedding-3-small',
        dimensions: 1536,
    })

    // Tune based on your raw content.
    // const splitter = new RecursiveCharacterTextSplitter({
    //     chunkSize: 1024,
    //     chunkOverlap: 200,
    // })

    // const splitAiAgentDocs = await splitter.splitDocuments(docs)

    console.log(JSON.stringify(newDocuments))

    const privateKey = c.env.SUPABASE_PRIVATE_KEY
    if (!privateKey) throw new Error('Expected env var SUPABASE_PRIVATE_KEY')

    const url = c.env.SUPABASE_URL
    if (!url) throw new Error('Expected env var SUPABASE_URL')

    const client = createClient(url, privateKey)

    console.log('2')
    const vectorStore = await SupabaseVectorStore.fromDocuments(newDocuments, embeddings, {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
    })

    console.log('3')

    const resultOne = await vectorStore.similaritySearch('What is the Text Classification model?', 3)

    console.log('4')
    console.log(resultOne)

    return c.text('Success')

    aiKnowledgeVectorstore = new CloudflareVectorizeStore(embeddings, {
        index: c.env.VECTORIZE_INDEX,
    })

    const pinecone = new Pinecone({
        apiKey: c.env.PINECONE_API_KEY,
    })

    const pineconeIndex = pinecone.Index(c.env.PINECONE_INDEX)

    // const docs = [
    //     new Document({
    //         metadata: { foo: 'bar' },
    //         pageContent: 'pinecone is a vector db',
    //     }),
    //     new Document({
    //         metadata: { foo: 'bar' },
    //         pageContent: 'the quick brown fox jumped over the lazy dog',
    //     }),
    //     new Document({
    //         metadata: { baz: 'qux' },
    //         pageContent: 'lorem ipsum dolor sit amet',
    //     }),
    //     new Document({
    //         metadata: { baz: 'qux' },
    //         pageContent: 'pinecones are the woody fruiting body and of a pine tree',
    //     }),
    // ]

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
        dimensions: 1536,
    })

    const privateKey = c.env.SUPABASE_PRIVATE_KEY
    if (!privateKey) throw new Error('Expected env var SUPABASE_PRIVATE_KEY')

    const url = c.env.SUPABASE_URL
    if (!url) throw new Error('Expected env var SUPABASE_URL')

    const client = createClient(url, privateKey)

    const vectorStore = new SupabaseVectorStore(embeddings, {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
    })

    const llm = new ChatOpenAI({ model: 'gpt-4-turbo', temperature: 0, apiKey: c.env.OPENAI_API_KEY })

    const retriever = vectorStore.asRetriever()

    // const chain = RetrievalQAChain.fromLLM(llm, retriever)

    const chain = new RetrievalQAChain({
        returnSourceDocuments: true,
        combineDocumentsChain: loadQAStuffChain(llm, { prompt }),
        retriever,
    })

    const res = await chain.invoke({
        query: 'What is the Text Classification model?',
    })

    const result = res.text
    console.log(result)
    return c.text(result)

    // const response2 = await retriever.invoke('What is the Text Classification model?')

    // console.log(response2)

    // aiKnowledgeVectorstore = new CloudflareVectorizeStore(embeddings, {
    //     index: c.env.VECTORIZE_INDEX,
    // })

    // const retriever = aiKnowledgeVectorstore.asRetriever()

    // const chain = RetrievalQAChain.fromLLM(llm, retriever)

    // const chain = new RetrievalQAChain({
    //     returnSourceDocuments: true,
    //     combineDocumentsChain: loadQAStuffChain(llm, { prompt }),
    //     retriever,
    // })

    // const res = await chain.invoke({
    //     query: 'Welche farbe hat der Apfel?',
    // })
    // console.log(res.text)

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
