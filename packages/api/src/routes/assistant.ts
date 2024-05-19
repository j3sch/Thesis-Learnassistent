import { eq } from 'drizzle-orm'
import { number, object, parse, string } from 'valibot'
import { ExerciseTable, SourceTable } from '../db/schema'
import { publicProcedure, router } from '../trpc'

export const NextExerciseSchema = object({
  exercise_id: number(),
})

export const CheckAnswerSchema = object({
  exercise_id: number(),
  message: string(),
})

export const assistantRouter = router({
  getExercise: publicProcedure
    .input((raw) => parse(NextExerciseSchema, raw))
    .query(async ({ input, ctx }) => {
      const { db } = ctx

      const exercise = await db
        .select({
          id: ExerciseTable.id,
          question: ExerciseTable.question,
          answer: ExerciseTable.answer,
          title: SourceTable.title,
          author: SourceTable.author,
          date: SourceTable.date,
          publisher: SourceTable.publisher,
          url: SourceTable.url,
          accessedOn: SourceTable.accessedOn,
        })
        .from(ExerciseTable)
        .leftJoin(SourceTable, eq(ExerciseTable.source, SourceTable.id))
        .where(eq(ExerciseTable.id, input.exercise_id))
        .get()

      console.log(exercise)
      return exercise
    }),
})
