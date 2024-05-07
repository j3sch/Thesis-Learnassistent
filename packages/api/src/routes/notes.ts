import { Hono } from 'hono'
import { CustomContext } from '@t4/types'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains'
import { PromptTemplate } from '@langchain/core/prompts'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { HtmlToTextTransformer } from '@langchain/community/document_transformers/html_to_text'

export type Bindings = {
    OPENAI_API_KEY: string
    SUPABASE_PRIVATE_KEY: string
    SUPABASE_URL: string
}

export const notes = new Hono<{ Bindings: Bindings }>()

// const promptTemplate = `Use the following pieces of context to answer the question at the end. If the information is not provided in the context, then just say that you don't know, don't try to make up an answer.

// {context}

// Question: {question}
// Answer in German:`

const promptTemplate = `Is the requested Information in the following context? Answer with Yes or No!.

{context}

Question: {question}
Answer in German:`
const prompt = PromptTemplate.fromTemplate(promptTemplate)

notes.post('/', async (c: CustomContext) => {
    const { text: url } = await c.req.json()

    const loader = new CheerioWebBaseLoader(url, {
        selector: 'article',
    })

    const docs = await loader.load()

    const splitter = RecursiveCharacterTextSplitter.fromLanguage('html')
    const transformer = new HtmlToTextTransformer({
        chunkSize: 512,
        chunkOverlap: 50,
    })

    const sequence = splitter.pipe(transformer)

    const newDocuments = await sequence.invoke(docs)

    const embeddings = new OpenAIEmbeddings({
        apiKey: c.env.OPENAI_API_KEY,
        model: 'text-embedding-3-small',
        dimensions: 1536,
    })

    const privateKey = c.env.SUPABASE_PRIVATE_KEY
    if (!privateKey) throw new Error('Expected env var SUPABASE_PRIVATE_KEY')

    const supabaseUrl = c.env.SUPABASE_URL
    if (!supabaseUrl) throw new Error('Expected env var SUPABASE_URL')

    const client = createClient(supabaseUrl, privateKey)

    await SupabaseVectorStore.fromDocuments(newDocuments, embeddings, {
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
        query: question,
    })
    console.log(JSON.stringify(res.sourceDocuments))

    const result = res.text
    console.log(result)
    return c.text(result)
})
