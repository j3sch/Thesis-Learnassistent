import { createDb } from './../db/client'
import { CustomContext } from '@t4/types'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import Groq from 'groq-sdk'
import { generateQAPromptMessages } from './prompt'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { ExerciseTable } from '../db/schema'
import { ChatCompletionAssistantMessageParam } from 'openai/resources'
import { initTogether } from './together'

export async function generateQAPairs(docs: Document[], c: CustomContext) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 250,
    })
    const splits = await textSplitter.splitDocuments(docs)

    // Entfernen von Zeilenumbrüchen in jedem Dokument
    const cleanedDocs = splits.map((doc) => {
        const cleaned = doc.pageContent.replace(/\n/g, '') // Ersetzt alle Vorkommen von \n durch nichts
        doc.pageContent = cleaned
        return doc
    })

    // const openai = c.get<OpenAI>('openai')

    // const groq = new Groq({
    //     apiKey: c.env.GROQ_API_KEY,
    // })

    const together = initTogether(c)

    const db = createDb(c.env.DB)

    for (const doc of cleanedDocs) {
        try {
            console.log('Schleifenstart')

            console.log(doc.pageContent)

            const chatCompletion = await together.chat.completions.create({
                messages: [
                    ...(generateQAPromptMessages as ChatCompletionAssistantMessageParam[]),
                    { role: 'user', content: doc.pageContent },
                ],
                model: 'meta-llama/Llama-3-70b-chat-hf',
                // model: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
                temperature: 0.2,
                stream: false,
            })

            const content = chatCompletion.choices[0]?.message?.content

            if (!content) continue

            const startIndex = content.indexOf('{')
            const endIndex = content.lastIndexOf('}') + 1 // +1, um das schließende } mit einzubeziehen

            if (startIndex === -1) {
                console.log('Skip - Content not suitable')
                continue
            }

            const jsonString = content.substring(startIndex, endIndex)

            console.log(jsonString)

            const qa: {
                question: string
                answer: string
            } = JSON.parse(jsonString)

            const newExercise = {
                question: qa.question,
                answer: qa.answer,
                source: doc.metadata.source,
            }

            console.log(newExercise)

            await db.insert(ExerciseTable).values(newExercise).run()

            console.log('--------------------------------------------')

            console.log('Schleifenende')
            // const res = await openai.chat.completions.create({
            //     model: 'gpt-4-turbo',
            //     stream: false,
            //     temperature: 0.3,
            //     messages: [...generateQAPromptMessages],
            // })
            // const message = res.choices[0].message.content
        } catch (e) {
            console.log(e)
        }
        // console.log(message)
    }
}
