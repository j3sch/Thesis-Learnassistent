import { Hono } from 'hono'
import OpenAI from 'openai'
import { CustomContext } from '@t4/types'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { ExerciseTable } from '../db/schema'
import { eq } from 'drizzle-orm'
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
import { BytesOutputParser } from 'langchain/schema/output_parser'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import { initOpenAi } from '../utils/openai'
import {
    Message as VercelChatMessage,
    StreamingTextResponse,
    createStreamDataTransformer,
    OpenAIStream,
    generateText,
    streamText,
} from 'ai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { StreamData } from 'ai'
import { doesResContainYes } from '../utils/doesResContainYes'

type SseBindings = {
    OPENAI_API_KEY: string
    TOGETHER_API_KEY: string
    DB: D1Database
}
// - If the provided 'User message' is an answer to the provided 'Question', then answer with 'Answer'.

// const canBeAnsweredBasedOnContext = (solution: string, chat_history: string, user_message: string) => `
// Your task is to decide if the provided information is enough to answer the user.
// If it is one of the following cases, then answer "Yes" otherwise "No":
// - If the User message is not a question.
// - If the User answered the question correctly.
// - If the User answered the question incorrectly.
// - If you are able to give feedback to the user's message based on the provided solution.
// - If the User message says "Gib mir ein Hinweis!".
// - If the User answers with a letter (A, B, C, D) to a multiple choice question.

// Solution: ${solution}

// Current conversation: [${chat_history}]

// user message: ${user_message}
// `

const canBeAnsweredBasedOnContextPrompt = (solution: string, chat_history: string, user_message: string) => `
You are a German Gemeinschaftskunde teacher. Review the provided chat history between you and your student, along with the solution. 
Your task is to decide whether the information provided is sufficient to answer the user's question.
If the information provided is sufficient, answer "Yes". 
If the message from the student is not a question, answer "Yes". 
Otherwise answer "No".

Current conversation: [${chat_history}]

user message: ${user_message}

Solution: ${solution}
`

// const isAnswerCorrectPrompt = (solution: string, chat_history: string, user_message: string) => `
// You are a German Gemeinschaftskunde teacher. Review the provided chat history between you and your student, along with the solution to the question.
// Your task is to decide if the user has answered the main idea of the question correctly. Answer with "Yes" if the user has answered correctly, otherwise answer with "No".

// Solution: ${solution}

// Current conversation: ${chat_history}

// user: ${user_message}
// `

const isAnswerCorrectPrompt = (user_message: string, feedback: string) => `
You are provided with a user message and the feedback from the teacher.
Your task is to review the feedback to check whether the user has done the exercise correctly or when the teacher has given the solution.
Answer with "Yes" if the user has done the exercise correctly or has received the feedback, otherwise answer with "No".

User: ${user_message}

Feedback: ${feedback}
`

const isUserMessageAQuestionPrompt = (user_message: string) => `
You are provided with a german user message. Your task is to decide if the user's message is a question.
Answer with "Yes" if the user's message is a question, otherwise answer with "No".

User's message: ${user_message}
`

const isSolutionEnoughPrompt = (user_message: string, solution: string) => `
You are provided with a german question and text. Your task is to decide if the information in the text is enough to answer the question.
Answer with "Yes" if the information is enough, otherwise answer with "No".

Question: ${user_message}

Text: ${solution}
`

const giveFeedbackPrompt = (
    solution: string
) => `You are a german Gemeinschaftskunde teacher. You are only allowed to use provided information. You are not allowed to make up an answer on your own. You should avoid repeating yourself.

You are provided with the Chat History between you and your student and the Solution to the Question. The student should answer the question correctly. 
If the user has correctly answered the main idea of the question, he has answered correctly.
Your task is to give your student feedback. The feedback should be educational and supportive, aimed at helping the user to understand the topic. But you shouldn't reveal the solution straight away. You should lead the student slowly to the solution by giving hints. The hints must be based on the information provided by the solution. 
You can ask questions to check your understanding to the question, but these questions must be able to be answered with the provided solution.
Your answer shouldn't be longer than 5 sentences.
- If you think your student is stuck, give him the solution. 
- If the user has correctly answered the main idea of the question then say only once "Hast du noch weitere Fragen?" after the last sentence.

Always speek directly to the student. Answer in German.

Solution: ${solution}`

// const promptTemplate = `Answer the user's message based only on the following context. If the answer is not in the context, reply politely that you do not have that information available.

// <context>
// {context}
// </context>

// {solution}

// User's message: {user_message}

// Chat history: {chat_history}

// Answer in German:`

// const prompt = PromptTemplate.fromTemplate(promptTemplate)

const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`
}

export const assistantSse = new Hono<{ Bindings: SseBindings }>()

assistantSse.post('/', async (c: CustomContext): Promise<any> => {
    const together = initTogether(c)
    const openai = initOpenAi(c)
    const { exercise_id, messages } = await c.req.json()
    console.log(exercise_id)
    console.log(messages[0].content)

    const db = createDb(c.env.DB)
    const exercise = await db.select().from(ExerciseTable).where(eq(ExerciseTable.id, exercise_id)).get()
    if (!exercise) {
        return new Error('Exercise not found')
    }
    const user_message = messages[messages.length - 1].content
    const question = exercise.question
    const messages_with_question = [{ role: 'assistant', content: question }, ...messages] as any[]
    const solution = exercise.answer
    const previousMessages = messages_with_question.slice(0, -1)
    const formattedPreviousMessages = messages_with_question.slice(0, -1).map(formatMessage)

    const { text: isUserMessageAQuestionRes } = await generateText({
        // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
        // model: together('meta-llama/Llama-3-70b-chat-hf'),
        model: openai('gpt-4o'),
        temperature: 0,
        messages: [
            {
                role: 'system',
                content: isUserMessageAQuestionPrompt(user_message),
            },
        ],
    })

    const isUserMessageAQuestion = doesResContainYes(isUserMessageAQuestionRes)

    console.log('is user message a question?', isUserMessageAQuestion)

    let isSolutionEnough = false

    if (isUserMessageAQuestion) {
        const { text: isSolutionEnoughRes } = await generateText({
            // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
            // model: together('meta-llama/Llama-3-70b-chat-hf'),
            model: openai('gpt-4o'),
            temperature: 0,
            messages: [
                {
                    role: 'system',
                    content: isSolutionEnoughPrompt(user_message, solution),
                },
            ],
        })
        isSolutionEnough = doesResContainYes(isSolutionEnoughRes)
    }

    if (!isUserMessageAQuestion || isSolutionEnough) {
        const giveFeedbackRes = await streamText({
            // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
            // model: together('meta-llama/Llama-3-70b-chat-hf'),
            model: openai('gpt-3.5-turbo'),
            temperature: 0.2,
            messages: [{ role: 'system', content: giveFeedbackPrompt(solution) }, ...messages_with_question],
        })

        let feedbackResult = ''

        const streamData = new StreamData()

        const stream = giveFeedbackRes.toAIStream({
            onText(text) {
                console.log(text)
                feedbackResult += text
            },
            async onFinal(_) {
                console.log(feedbackResult)
                const { text } = await generateText({
                    // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
                    model: together('meta-llama/Llama-3-70b-chat-hf'),
                    // model: openai('gpt-3.5-turbo'),
                    temperature: 0,
                    messages: [
                        {
                            role: 'system',
                            content: isAnswerCorrectPrompt(user_message, feedbackResult),
                        },
                    ],
                })

                const isAnswerCorrectLowerCase = text?.toLowerCase()

                if (isAnswerCorrectLowerCase) {
                    const isAnswerCorrect = isAnswerCorrectLowerCase.includes('yes')
                    console.log('is answer correct?', isAnswerCorrect)
                    streamData.append({
                        isCorrect: isAnswerCorrect,
                    })
                    streamData.close()
                } else {
                    streamData.append({
                        isCorrect: false,
                    })
                    streamData.close()
                }
            },
        })

        return new StreamingTextResponse(stream, {}, streamData)
    }

    if (!isSolutionEnough) {
        console.log('Solution is not enough')

        const embeddings = new OpenAIEmbeddings({
            apiKey: c.env.OPENAI_API_KEY,
            model: 'text-embedding-3-small',
            dimensions: 1536,
        })

        const client = initSupabase(c)

        const parser = new HttpResponseOutputParser()

        const llm = new ChatOpenAI({
            model: 'gpt-3.5-turbo',
            temperature: 0.2,
            apiKey: c.env.OPENAI_API_KEY,
            streaming: true,
        })

        const vectorStore = new SupabaseVectorStore(embeddings, {
            client,
            tableName: 'documents',
            queryName: 'match_documents',
        })

        const retriever = vectorStore.asRetriever()

        const contextualizeQSystemPrompt = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`

        const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
            ['system', contextualizeQSystemPrompt],
            new MessagesPlaceholder('chat_history'),
            ['human', '{question}'],
        ])
        const contextualizeQChain = contextualizeQPrompt.pipe(llm).pipe(new StringOutputParser())

        const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.

{context}`

        const qaPrompt = ChatPromptTemplate.fromMessages([
            ['system', qaSystemPrompt],
            new MessagesPlaceholder('chat_history'),
            ['human', '{question}'],
        ])

        const contextualizedQuestion = (input: Record<string, unknown>) => {
            if ('chat_history' in input) {
                return contextualizeQChain
            }
            return input.question
        }

        const ragChain = RunnableSequence.from([
            RunnablePassthrough.assign({
                context: (input: Record<string, unknown>) => {
                    if ('chat_history' in input) {
                        const chain = contextualizedQuestion(input)
                        // @ts-ignore
                        return chain.pipe(retriever).pipe(formatDocumentsAsString)
                    }
                    return ''
                },
            }),
            qaPrompt,
            llm,
            parser,
        ])

        function formatOpenAiMessages(messages: VercelChatMessage[]) {
            return messages.map((message) => {
                if (message.role === 'assistant') {
                    return new AIMessage(message.content)
                }
                if (message.role === 'user') {
                    return new HumanMessage(message.content)
                }
            })
        }

        const aiMsg = await ragChain.stream({
            question: user_message,
            chat_history: formatOpenAiMessages(previousMessages),
        })

        const langchainStream = aiMsg.pipeThrough(createStreamDataTransformer())

        return new StreamingTextResponse(langchainStream)
    }
})
