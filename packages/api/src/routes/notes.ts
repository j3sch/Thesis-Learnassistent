import { ExerciseTable, SourceTable } from './../db/schema'
import { Hono } from 'hono'
import { CustomContext } from '@t4/types'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains'
import { PromptTemplate } from '@langchain/core/prompts'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { generateQAPairs } from '../utils/generate_qa_pairs'
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import { BasePromptTemplate } from '@langchain/core/prompts'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { initSupabase } from '../utils/supabase'
import { generateMetaData } from '../utils/generateMetaData'
import { createDb } from '../db/client'
import { eq } from 'drizzle-orm'

export type Bindings = {
    OPENAI_API_KEY: string
    SUPABASE_PRIVATE_KEY: string
    SUPABASE_URL: string
    TOGETHER_API_KEY: string
    DB: D1Database
}

export const notes = new Hono<{ Bindings: Bindings }>()

const promptTemplate = `Use the following pieces of context to answer the question at the end. If the information is not provided in the context, then just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Answer in German:`

// const promptTemplate = `Is the requested Information in the following context? Answer with Yes or No!.

// {context}

const rephrasePrompt = `Du bist ein Gemeinschaftskundenlehrer

Chat History: {chat_history}
User Input: {input}` as unknown as BasePromptTemplate<any>

// Question: {question}
// Answer in German:`
const prompt = PromptTemplate.fromTemplate(promptTemplate)

notes.post('/', async (c: CustomContext) => {
    const { text: url } = await c.req.json()

    const loader = new CheerioWebBaseLoader(url, {
        selector: 'article',
    })

    const docs = await loader.load()

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 150,
    })
    const splits = await textSplitter.splitDocuments(docs)

    const cleanedDocs = splits.map((doc) => {
        const cleaned = doc.pageContent.replace(/\n/g, '') // Ersetzt alle Vorkommen von \n durch nichts
        doc.pageContent = cleaned
        return doc
    })

    await generateQAPairs(docs, c, url)

    // const splitter = RecursiveCharacterTextSplitter.fromLanguage('html', {
    //     chunkSize: 1000,
    //     chunkOverlap: 100,
    // })
    // const transformer = new HtmlToTextTransformer()
    // const sequence = splitter.pipe(transformer)
    // const newDocuments = await sequence.invoke(docs)
    // console.log(JSON.stringify(newDocuments))

    const embeddings = new OpenAIEmbeddings({
        apiKey: c.env.OPENAI_API_KEY,
        model: 'text-embedding-3-small',
        dimensions: 1536,
    })

    const client = initSupabase(c)

    await SupabaseVectorStore.fromDocuments(cleanedDocs, embeddings, {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
    })

    return c.text('Success')
})

notes.get('/', async (c: CustomContext) => {
    const { text: question } = await c.req.json()

    const embeddings = new OpenAIEmbeddings({
        apiKey: c.env.OPENAI_API_KEY,
        model: 'text-embedding-3-small',
        dimensions: 1536,
    })

    const client = initSupabase(c)

    const vectorStore = new SupabaseVectorStore(embeddings, {
        client,
        tableName: 'documents',
        queryName: 'match_documents',
    })

    const llm = new ChatOpenAI({ model: 'gpt-4-turbo', temperature: 0, apiKey: c.env.OPENAI_API_KEY, streaming: true })

    const retriever = vectorStore.asRetriever()

    // const chain = RetrievalQAChain.fromLLM(llm, retriever)

    // const chaindd = await createHistoryAwareRetriever({
    //     llm,
    //     retriever,
    //     rephrasePrompt,
    // })
    // const resultdd = await chaindd.invoke({ input: '...', chat_history: [] })

    const chain = new RetrievalQAChain({
        returnSourceDocuments: true,
        combineDocumentsChain: loadQAStuffChain(llm, { prompt }),
        retriever,
    })

    const res = await chain.invoke({
        query: question,
    })
    console.log(JSON.stringify(res.sourceDocuments))

    const result = res.text
    console.log(result)
    return c.text(result)
})
