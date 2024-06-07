import { eq, is } from 'drizzle-orm'
import { number, object, parse, string, boolean, optional } from 'valibot'
import { ExerciseTable, SourceTable } from '../db/schema'
import { publicProcedure, router } from '../trpc'
import { Hono } from 'hono'
import { CustomContext } from '@t4/types'
import { createDb } from '../db/client'

export const NextExerciseSchema = object({
  id: number(),
  isNewCard: boolean(),
})

export const CheckAnswerSchema = object({
  exercise_id: number(),
  message: string(),
})

export const exerciseRouter = router({
  get: publicProcedure
    .input((raw) => parse(NextExerciseSchema, raw))
    .query(async ({ input, ctx }) => {
      const { db, c } = ctx
      try {
        if (input.isNewCard) {
          const exercise = await db
            .select({
              id: ExerciseTable.id,
              question: ExerciseTable.question,
              answer: ExerciseTable.answer,
              conciseAnswer: ExerciseTable.conciseAnswer,
              orderIndex: ExerciseTable.orderIndex,
              title: SourceTable.title,
              author: SourceTable.author,
              date: SourceTable.date,
              publisher: SourceTable.publisher,
              img: SourceTable.img,
              url: SourceTable.url,
              accessedOn: SourceTable.accessedOn,
            })
            .from(ExerciseTable)
            .leftJoin(SourceTable, eq(ExerciseTable.sourceId, SourceTable.id))
            .where(eq(ExerciseTable.orderIndex, input.id))
            .get()

          if (!exercise) {
            const isEven = input.id % 2 === 0
            const firstExerciseId = isEven ? 2 : 1

            return await db
              .select({
                id: ExerciseTable.id,
                question: ExerciseTable.question,
                answer: ExerciseTable.answer,
                conciseAnswer: ExerciseTable.conciseAnswer,
                orderIndex: ExerciseTable.orderIndex,
                title: SourceTable.title,
                author: SourceTable.author,
                date: SourceTable.date,
                publisher: SourceTable.publisher,
                img: SourceTable.img,
                url: SourceTable.url,
                accessedOn: SourceTable.accessedOn,
              })
              .from(ExerciseTable)
              .leftJoin(SourceTable, eq(ExerciseTable.sourceId, SourceTable.id))
              .where(eq(ExerciseTable.orderIndex, firstExerciseId))
              .get()
          }

          return exercise
        }

        console.log('exercise by id')
        return await db
          .select({
            id: ExerciseTable.id,
            question: ExerciseTable.question,
            answer: ExerciseTable.answer,
            conciseAnswer: ExerciseTable.conciseAnswer,
            orderIndex: ExerciseTable.orderIndex,
            title: SourceTable.title,
            author: SourceTable.author,
            date: SourceTable.date,
            publisher: SourceTable.publisher,
            img: SourceTable.img,
            url: SourceTable.url,
            accessedOn: SourceTable.accessedOn,
          })
          .from(ExerciseTable)
          .leftJoin(SourceTable, eq(ExerciseTable.sourceId, SourceTable.id))
          .where(eq(ExerciseTable.id, input.id))
          .get()
      } catch (error) {
        console.log(error)
        if (error instanceof Error) {
          return c.text(error.message)
        }
      }
    }),
})

export type Bindings = {
  DB: D1Database
}

export const exercise = new Hono<{ Bindings: Bindings }>()

exercise.post('/shuffle', async (c: CustomContext) => {
  const db = createDb(c.env.DB)

  const exerciseIds = await db
    .select({
      id: ExerciseTable.id,
    })
    .from(ExerciseTable)
    .all()

  // Shuffle-Algorithmus
  for (let i = exerciseIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // Elemente vertauschen
    const temp = exerciseIds[i]
    exerciseIds[i] = exerciseIds[j]
    exerciseIds[j] = temp
  }

  // Update orderIndex beginnend bei 1
  for (let i = 0; i < exerciseIds.length; i++) {
    await db
      .update(ExerciseTable)
      .set({ orderIndex: i + 1 }) // Setze den orderIndex basierend auf der Position im Array, beginnend bei 1
      .where(eq(ExerciseTable.id, exerciseIds[i].id)) // Verwende die geshuffelte ID
      .run()
  }

  return c.text('Success')
})
