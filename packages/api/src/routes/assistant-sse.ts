import { Hono } from 'hono'
import OpenAI from 'openai'
import { CustomContext } from '@t4/types'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { ExerciseTable } from '../db/schema'
import { eq } from 'drizzle-orm'
import { OpenAIStream, StreamingTextResponse, LangChainAdapter, createStreamDataTransformer } from 'ai'
import { initTogether } from '../utils/together'
import { createDb } from '../db/client'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { RetrievalQAChain, loadQAStuffChain } from 'langchain/chains'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { initSupabase } from '../utils/supabase'
import { PromptTemplate } from '@langchain/core/prompts'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { pull } from 'langchain/hub'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { LangChainStream } from 'ai'
import { BytesOutputParser } from 'langchain/schema/output_parser'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import { initOpenAi } from '../utils/openai'

type SseBindings = {
    OPENAI_API_KEY: string
    TOGETHER_API_KEY: string
    DB: D1Database
}
// - If the provided 'User message' is an answer to the provided 'Question', then answer with 'Answer'.

const typeOfUserMessagePrompt = (message: string) => `
- If the provided 'User message' is a question, then answer with 'Question'.
- Else answer with 'Answer'.

User message: ${message}`

const giveFeedbackPrompt = (
    solution: string
) => `You are a german Gemeinschaftskunde teacher. You are only allowed to use provided information. You are not allowed to make up an answer on your own. You should avoid repeating yourself. Answer in German.

You are provided with the Chat History between you and your student and the Solution to the Question. The student should answer the question correctly. Your task is to give your student feedback. The feedback should be educational and supportive, aimed at helping the user to understand the topic. But you shouldn't reveal the solution straight away. You should lead the student slowly to the solution by giving hints. The hints must be based on the information provided by the solution. If you think your student is stuck, give him/her the solution. Always speek directly to the student. 

Solution: ${solution}`

const promptTemplate = `Answer the user's questions based only on the following context. If the answer is not in the context, reply politely that you do not have that information available.

<context>
{context}
</context>

Question: {question}
Answer in German:`

const prompt = PromptTemplate.fromTemplate(promptTemplate)

export const assistantSse = new Hono<{ Bindings: SseBindings }>()

assistantSse.post('/', async (c: CustomContext): Promise<any> => {
    const together = initTogether(c)
    const openai = initOpenAi(c)
    const { exercise_id, messages } = await c.req.json()
    console.log(exercise_id)
    console.log(messages[0].content)

    const user_message = messages[messages.length - 1].content

    const res = await together.chat.completions.create({
        // model: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
        model: 'meta-llama/Llama-3-70b-chat-hf',
        // model: 'gpt-3.5-turbo',
        stream: false,
        temperature: 0,
        messages: [{ role: 'system', content: typeOfUserMessagePrompt(user_message) }],
    })
    const res_message = res.choices[0].message.content?.toLowerCase()
    const type_of_user_message = res_message?.includes('question') ? 'Question' : 'Answer'

    const db = createDb(c.env.DB)
    const exercise = await db.select().from(ExerciseTable).where(eq(ExerciseTable.id, exercise_id)).get()
    if (!exercise) {
        return new Error('Exercise not found')
    }
    const question = exercise.question
    const solution = exercise.answer
    const messages_with_question = [{ role: 'assistant', content: question }, ...messages] as any[]

    if (type_of_user_message === 'Answer') {
        console.log('Answer')

        const res = await openai.chat.completions.create({
            // model: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
            // model: 'meta-llama/Llama-3-70b-chat-hf',
            model: 'gpt-4-turbo',
            temperature: 0.2,
            stream: true,
            messages: [{ role: 'system', content: giveFeedbackPrompt(solution) }, ...messages_with_question],
        })

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(res)

        return new StreamingTextResponse(stream)
    }

    if (type_of_user_message === 'Question') {
        console.log('Question')

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

        const parser = new HttpResponseOutputParser()

        const llm = new ChatOpenAI({
            model: 'gpt-4-turbo',
            temperature: 0,
            apiKey: c.env.OPENAI_API_KEY,
            streaming: true,
        })

        const retriever = vectorStore.asRetriever()

        const chains = RunnableSequence.from([
            {
                context: retriever.pipe(formatDocumentsAsString),
                question: new RunnablePassthrough(),
            },
            prompt,
            llm,
            parser,
        ])

        const res = await chains.stream(user_message)

        return new StreamingTextResponse(res.pipeThrough(createStreamDataTransformer()))
    }
})
