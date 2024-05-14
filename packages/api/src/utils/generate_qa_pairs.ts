import { createDb } from './../db/client'
import { CustomContext } from '@t4/types'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { generateQAPromptMessage } from './prompt'
import { ExerciseTable, SourceTable } from '../db/schema'
import { initTogether } from './together'
import { generateMetaData } from './generateMetaData'
import { CoreMessage, generateText } from 'ai'
import { initOpenAi } from './openai'
import { initPerplexity } from './initPerplexity'

export async function generateQAPairs(docs: Document[], c: CustomContext, url: string) {
    const metadata = (await generateMetaData(url, c)) as {
        title?: string
        author?: string
        date?: string
        publisher?: string
        url: string
    }

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

    const together = initTogether(c)
    const openai = initOpenAi(c)
    const perplexity = initPerplexity(c)
    const db = createDb(c.env.DB)

    for (const doc of cleanedDocs) {
        try {
            console.log('Schleifenstart')

            const { text } = await generateText({
                // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
                // model: perplexity('llama-3-70b-instruct'),
                // model: together('meta-llama/Llama-3-70b-chat-hf'),
                model: openai('gpt-4o'),
                temperature: 0.2,
                messages: [generateQAPromptMessage as CoreMessage, { role: 'user', content: doc.pageContent }],
            })

            if (!text) continue

            const startIndex = text.indexOf('{')
            const endIndex = text.lastIndexOf('}') + 1 // +1, um das schließende } mit einzubeziehen

            if (startIndex === -1) {
                console.log('Skip - Content not suitable')
                continue
            }

            const jsonString = text.substring(startIndex, endIndex)

            const qa: {
                question: string
                answer: string
            } = JSON.parse(jsonString)

            const newExercise = {
                question: qa.question,
                answer: qa.answer,
            }

            console.log(newExercise)

            const source = await db
                .insert(SourceTable)
                .values({
                    title: metadata.title,
                    author: metadata.author,
                    date: metadata.date,
                    publisher: metadata.publisher,
                    url,
                })
                .returning()

            await db
                .insert(ExerciseTable)
                .values({
                    ...newExercise,
                    source: source[0].id,
                })
                .run()

            console.log('--------------------------------------------')

            console.log('Schleifenende')
        } catch (e) {
            console.log(e)
        }
    }
}
