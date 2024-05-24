import { createDb } from './../db/client'
import { CustomContext } from '@t4/types'
import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import {
    contentNotSuitableExample,
    democracyNotIdealExample,
    distributionOfTaxRevenuesExample,
    generateQAPromptMessage,
    meaningDemocracyExample,
} from './prompt'
import { ExerciseTable, SourceTable } from '../db/schema'
import { initTogether } from './together'
import { generateMetaData } from './generateMetaData'
import { CoreMessage, generateText } from 'ai'
import { initOpenAi } from './openai'
import { initPerplexity } from './perplexity'
import { initAnthropic } from './anthropic'

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

    const openai = initOpenAi(c)
    const perplexity = initPerplexity(c)
    const db = createDb(c.env.DB)

    for (const doc of cleanedDocs) {
        try {
            console.log('----------------Schleifenstart----------------')

            console.log('page content: \n', doc.pageContent)

            const { text } = await generateText({
                // model: together('mistralai/Mixtral-8x22B-Instruct-v0.1'),
                model: perplexity('llama-3-70b-instruct'),
                // model: anthropic('claude-3-sonnet-20240229'),
                // model: together('meta-llama/Llama-3-70b-chat-hf'),
                // model: openai('gpt-4o'),
                // model: openai('gpt-4-turbo'),
                temperature: 0.2,
                messages: [
                    generateQAPromptMessage as CoreMessage,
                    ...(meaningDemocracyExample as CoreMessage[]),
                    ...(distributionOfTaxRevenuesExample as CoreMessage[]),
                    ...(democracyNotIdealExample as CoreMessage[]),
                    ...(contentNotSuitableExample as CoreMessage[]),
                    { role: 'user', content: doc.pageContent },
                ],
            })

            console.log('generate exercise res text: \n', text)

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
                conciseAnswer: string
            } = JSON.parse(jsonString)

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
                    question: qa.question,
                    answer: qa.answer,
                    conciseAnswer: qa.conciseAnswer,
                    source: source[0].id,
                })
                .run()

            console.log('----------------Schleifenende----------------')
        } catch (e) {
            console.log(e)
        }
    }
}
