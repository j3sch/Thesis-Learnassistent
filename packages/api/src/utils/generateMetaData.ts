import { CustomContext } from '@t4/types'
import { generateText } from 'ai'
import { Context } from 'hono'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { initOpenAi } from './openai'
import { initTogether } from './together'
import * as cheerio from 'cheerio'

export async function generateMetaData(url: string, c: Context) {
    return await fetch(url)
        .then((result) => result.text())
        .then((html) => {
            const $ = cheerio.load(html)
            const title =
                $('meta[property="og:title"]').attr('content') ||
                $('title').text() ||
                $('meta[name="title"]').attr('content')
            const author = $('meta[name="author"]').attr('content')
            const date = $('meta[name="date"]').attr('content')
            const publisher = $('meta[name="publisher"]').attr('content')

            return {
                title,
                author,
                date,
                publisher,
                url,
            }
        })
        .catch((error) => {
            console.log(error)
        })
}
