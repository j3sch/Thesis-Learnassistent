import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'
import { EXERCISE_TYPES_ARRAY, EXERCISE_TYPES_ENUM } from '@t4/types'
import { serial } from 'drizzle-orm/mysql-core'

//   type: text('type', { enum: EXERCISE_TYPES_ARRAY as [string, ...string[]] }),

export const ExerciseTable = sqliteTable('Exercise', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    question: text('question').notNull(),
    answer: text('solution').notNull(),
    source: integer('source_id', { mode: 'number' }),
})

export type Exercise = InferSelectModel<typeof ExerciseTable>
export type InsertExercise = InferInsertModel<typeof ExerciseTable>
export const insertExerciseSchema = createInsertSchema(ExerciseTable)
export const selectExerciseSchema = createSelectSchema(ExerciseTable)

export const NoteTable = sqliteTable('Note', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    text: text('text').notNull(),
})

export type Note = InferSelectModel<typeof NoteTable>
export type InsertNote = InferInsertModel<typeof NoteTable>
export const insertNoteSchema = createInsertSchema(NoteTable)
export const selectNoteSchema = createSelectSchema(NoteTable)

export const SourceTable = sqliteTable('Source', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title'),
    author: text('author'),
    date: text('date'),
    publisher: text('publisher'),
    url: text('url').notNull(),
    accessedOn: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`),
})

export const exerciseRelations = relations(ExerciseTable, ({ one }) => ({
    source: one(SourceTable, {
        fields: [ExerciseTable.source],
        references: [SourceTable.id],
    }),
}))

export type Source = InferSelectModel<typeof SourceTable>
export type InsertSource = InferInsertModel<typeof SourceTable>
export const insertSourceSchema = createInsertSchema(SourceTable)
export const selectSourceSchema = createSelectSchema(SourceTable)
