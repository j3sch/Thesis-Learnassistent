import { eq } from 'drizzle-orm'
import { number, object, parse, string } from 'valibot'
import { ExerciseTable } from '../db/schema'
import { publicProcedure, router } from '../trpc'
import OpenAI from 'openai'

export const NextExerciseSchema = object({
  exercise_id: number(),
})

export const CheckAnswerSchema = object({
  exercise_id: number(),
  message: string(),
})

export const assistantRouter = router({
  getNextExercise: publicProcedure
    .input((raw) => parse(NextExerciseSchema, raw))
    .query(async ({ input, ctx }) => {
      const { db } = ctx

      const exercise = await db
        .select()
        .from(ExerciseTable)
        .where(eq(ExerciseTable.id, input.exercise_id))
        .get()
      return exercise
    }),
  checkAnswer: publicProcedure
    .input((raw) => parse(CheckAnswerSchema, raw))
    .query(async ({ input, ctx }) => {
      const { db, c } = ctx
    }),
})
