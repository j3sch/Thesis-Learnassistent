import { CustomContext } from '@t4/types'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import OpenAI from 'openai'
import Groq from 'groq-sdk'
import { generateQAPromptMessages } from './prompt'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { ExerciseTable } from '../db/schema'

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

    const groq = new Groq({
        apiKey: c.env.GROQ_API_KEY,
    })

    const db = c.get<DrizzleD1Database>('db')

    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    for (const doc of cleanedDocs) {
        try {
            console.log('Schleifenstart')

            const chatCompletion = await groq.chat.completions.create({
                messages: [...generateQAPromptMessages, { role: 'user', content: doc.pageContent }],
                model: 'llama3-70b-8192',
                temperature: 0.3,
                stream: false,
            })

            const content = chatCompletion.choices[0]?.message?.content

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

            await delay(20000) // Warte 20 Sekunden
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
