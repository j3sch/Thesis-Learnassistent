import { Hono } from 'hono'
import { CustomContext } from '@t4/types'
import { ExerciseTable } from '../db/schema'
import { eq } from 'drizzle-orm'
import { initTogether } from '../utils/together'
import { createDb } from '../db/client'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { initSupabase } from '../utils/supabase'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
import { HttpResponseOutputParser } from 'langchain/output_parsers'
import { initOpenAi } from '../utils/openai'
import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
  generateText,
  streamText,
} from 'ai'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { StreamData } from 'ai'
import { doesResContainYes } from '../utils/doesResContainYes'
import { initAnthropic } from '../utils/anthropic'
import { initPerplexity } from '../utils/perplexity'
import { giveFeedbackPrompt } from '../prompts/feedbackPrompt'
import { checkKeywordsInAnswer } from '../utils/checkKeywordsInAnswer'

type SseBindings = {
  OPENAI_API_KEY: string
  TOGETHER_API_KEY: string
  DB: D1Database
  PERPLEXITY_API_KEY: string
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

const canBeAnsweredBasedOnContextPrompt = (
  solution: string,
  chat_history: string,
  user_message: string
) => `
You are a German Gemeinschaftskunde teacher. Review the provided chat history between you and your student, along with the solution. 
Your task is to decide whether the information provided is sufficient to answer the user's question.
If the information provided is sufficient, answer "Yes". 
If the message from the student is not a question, answer "Yes". 
Otherwise answer "No".

Current conversation: [${chat_history}]

user message: ${user_message}

Solution: ${solution}
`

const wrongAnswerExample = []

// const isAnswerCorrectPrompt = (solution: string, chat_history: string, user_message: string) => `
// You are a German Gemeinschaftskunde teacher. Review the provided chat history between you and your student, along with the solution to the question.
// Your task is to decide if the user has answered the main idea of the question correctly. Answer with "Yes" if the user has answered correctly, otherwise answer with "No".

// Solution: ${solution}

// Current conversation: ${chat_history}

// user: ${user_message}
// `

const isAnswerCorrectPrompt = (question: string, solution: string) => `
You are only allowed to answer with "true" or "false".
Don't try to give the user feedback. 
You are provided with the Question, the Chat-History between you and your student and the Solution to the Question.

Use the following steps to respond to user input. Fully restate each step before proceeding.

Step 1. Look for keywords in the feedback from the tutor:
- If the tutor says something like "nicht korrekt/nicht richtig/nicht ganz korrekt/nicht ganz richtig" then answer with "false".
- If the tutor says something like "ist ein guter Anfang" then answer with "false".
- If the tutor says something like "ist richtig/korrekt" or "sehr gut/gut gemacht" then answer with "true".

If none of the above keywords are present, then continue to step 2.

Step 2. Critically analyse the chat history to check whether the user has answered the question correctly:
- If the user has not answered the question correctly or has not received the solution, answer with "false".
- If the user has answered the question correctly or has received the solution, answer with "true".

Question: ${question}

Solution: ${solution}
`

const newIsAnswerCorrectPrompt = (question: string, solution: string) => `
You are only allowed to answer with "true" or "false".
Don't try to give the user feedback.
You are provided with the Question, the Chat-History between you and your student and the Solution to the Question.

Carefully compare the user's responses in the chat history with the provided solution to determine if the question has been answered correctly
- If the user has not answered the question correctly or has not received the solution, answer with "false".
- If the user has answered the question correctly or has received the solution, answer with "true".

Question: ${question}

Solution: ${solution}
`

// Your task is to review the Chat-History critically to check whether the user has answered the question correctly or when the tutor has given the solution.
// Answer with "true" if the user has answered the question correctly or has received the feedback, otherwise answer with "false".

const isUserMessageAQuestionPrompt = () => `
You are provided with a german user message. Your task is to decide if the user's message is a question.
Answer with "Yes" if the user's message is a question, otherwise answer with "No".
`

const isSolutionEnoughPrompt = (question: string, solution: string) => `
You are provided with the Question, the Solution to the Question and the Chat-History between you and your student
Your task is to decide if the information in the provided solution in enough to give feedback to the user. 
Answer with "Yes" if the information is enough, otherwise answer with "No". Don't try to make up an answer.

Question: ${question}

Solution: ${solution}
`

// - The feedback should be educational and supportive.

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
  const anthropic = initAnthropic(c)
  const perplexity = initPerplexity(c)

  const { exercise_id, messages } = await c.req.json()
  console.log(exercise_id)
  console.log(messages[0].content)

  const db = createDb(c.env.DB)
  const exercise = await db
    .select()
    .from(ExerciseTable)
    .where(eq(ExerciseTable.orderIndex, exercise_id))
    .get()
  if (!exercise) {
    return new Error('Exercise not found')
  }
  const user_message = messages[messages.length - 1].content
  const question = exercise.question
  const messages_with_question = [{ role: 'assistant', content: question }, ...messages] as any[]
  const solution = exercise.answer
  const previousMessages = messages_with_question.slice(0, -1)
  const formattedPreviousMessages = messages_with_question.slice(0, -1).map(formatMessage)

  console.log(messages[messages.length - 1])

  const { text: isUserMessageAQuestionRes } = await generateText({
    // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
    // model: together('meta-llama/Llama-3-70b-chat-hf'),
    model: perplexity('llama-3-70b-instruct'),
    // model: openai('gpt-4o'),
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: isUserMessageAQuestionPrompt(),
      },
      messages[messages.length - 1],
    ],
  })

  const isUserMessageAQuestion = doesResContainYes(isUserMessageAQuestionRes)

  console.log('is user message a question?', isUserMessageAQuestion)

  let isSolutionEnough = false

  if (isUserMessageAQuestion) {
    const { text: isSolutionEnoughRes } = await generateText({
      // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
      // model: together('meta-llama/Llama-3-70b-chat-hf'),
      model: perplexity('llama-3-70b-instruct'),
      // model: openai('gpt-4o'),
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: isSolutionEnoughPrompt(question, solution),
        },
        ...messages,
      ],
    })
    isSolutionEnough = doesResContainYes(isSolutionEnoughRes)
  }

  console.log('is solution enough?', isSolutionEnough)

  if (!isUserMessageAQuestion || isSolutionEnough) {
    const giveFeedbackRes = await streamText({
      // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
      // model: together('meta-llama/Llama-3-70b-chat-hf'),
      system: giveFeedbackPrompt(question, solution),
      // model: anthropic('claude-3-sonnet-20240229'),
      // model: perplexity('llama-3-70b-instruct'),
      model: openai('gpt-4o'),
      // model: perplexity('llama-3-70b-instruct'),
      // model: openai('gpt-4-turbo'),
      temperature: 0.2,
      messages: messages,
    })

    let feedbackResult = ''

    const streamData = new StreamData()

    const stream = giveFeedbackRes.toAIStream({
      onText(text) {
        feedbackResult += text
      },
      async onFinal(_) {
        console.log('feedback:', feedbackResult)
        let isAnswerCorrect = false
        const isAnsweCorrectKeywords = checkKeywordsInAnswer(feedbackResult)

        console.log('isAnsweCorrectKeywords', isAnsweCorrectKeywords)

        if (isAnsweCorrectKeywords === undefined) {
          const { text } = await generateText({
            // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
            // model: together('meta-llama/Llama-3-70b-chat-hf'),
            model: perplexity('llama-3-70b-instruct'),
            // model: perplexity('mixtral-8x7b-instruct'),
            // model: openai('gpt-4o'),
            temperature: 0,
            messages: [
              {
                role: 'system',
                content: newIsAnswerCorrectPrompt(question, solution),
              },
              ...messages,
            ],
          })

          const isAnswerCorrectLowerCase = text?.toLowerCase()
          console.log('isAnswerCorrectLowerCase', isAnswerCorrectLowerCase)
          console.log('is answer correct? string', isAnswerCorrectLowerCase)

          if (isAnswerCorrectLowerCase) {
            isAnswerCorrect = isAnswerCorrectLowerCase.includes('true')
          } else {
            isAnswerCorrect = false
          }
        } else {
          isAnswerCorrect = isAnsweCorrectKeywords
        }

        streamData.append({
          isCorrect: isAnswerCorrect,
        })
        streamData.close()
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
      model: 'gpt-4o',
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
