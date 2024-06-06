import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'

export const ExerciseTable = sqliteTable('Exercise', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  conciseAnswer: text('concise_answer').notNull(),
  sourceId: integer('source_id', { mode: 'number' }),
  orderIndex: integer('order_index', { mode: 'number' }),
})

export type Exercise = InferSelectModel<typeof ExerciseTable>
export type InsertExercise = InferInsertModel<typeof ExerciseTable>
export const insertExerciseSchema = createInsertSchema(ExerciseTable)
export const selectExerciseSchema = createSelectSchema(ExerciseTable)

export const SourceTable = sqliteTable('Source', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  title: text('title'),
  author: text('author'),
  date: text('date'),
  publisher: text('publisher'),
  url: text('url').notNull(),
  img: text('img'),
  accessedOn: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`),
})

export const exerciseRelations = relations(ExerciseTable, ({ one }) => ({
  source: one(SourceTable, {
    fields: [ExerciseTable.sourceId],
    references: [SourceTable.id],
  }),
}))

export type Source = InferSelectModel<typeof SourceTable>
export type InsertSource = InferInsertModel<typeof SourceTable>
export const insertSourceSchema = createInsertSchema(SourceTable)
export const selectSourceSchema = createSelectSchema(SourceTable)
