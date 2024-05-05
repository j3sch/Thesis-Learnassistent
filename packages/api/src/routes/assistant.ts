import { eq } from 'drizzle-orm'
import { number, object, parse, string } from 'valibot'
import { ExerciseTable } from '../db/schema'
import { publicProcedure, router } from '../trpc'

export const NextExerciseSchema = object({
  exercise_id: number(),
})

export const assistantRouter = router({
  getNextExercise: publicProcedure
    .input((raw) => parse(NextExerciseSchema, raw))
    .query(async ({ input, ctx }) => {
      const { db } = ctx
      console.log('first')
      return {
        id: 1,
        question: 'Liste fünf Grundrechte auf, die im Grundgesetz verankert sind',
        solution:
          'Meinungsfreiheit, Versammlungsfreiheit, Glaubensfreiheit, Freiheit der Person, Freizügigkeit',
        type: 'text',
      }
      const exercise = await db
        .select()
        .from(ExerciseTable)
        .where(eq(ExerciseTable.id, input.exercise_id))
        .get()
      return exercise
    }),
})
