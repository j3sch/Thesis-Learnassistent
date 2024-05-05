import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'
import { EXERCISE_TYPES_ARRAY, EXERCISE_TYPES_ENUM } from '@t4/types'

export const ExerciseTable = sqliteTable('Exercise', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    type: text('type', { enum: EXERCISE_TYPES_ARRAY as [string, ...string[]] }),
    question: text('question').notNull(),
    solution: text('solution').notNull(),
})

export type Exercise = InferSelectModel<typeof ExerciseTable>
export type InsertExercise = InferInsertModel<typeof ExerciseTable>
export const insertExerciseSchema = createInsertSchema(ExerciseTable)
export const selectExerciseSchema = createSelectSchema(ExerciseTable)
