import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'
import { EXERCISE_TYPES_ARRAY, EXERCISE_TYPES_ENUM } from '@t4/types'
import { enum_ } from 'valibot'
// User
export const UserTable = sqliteTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
})

export type User = InferSelectModel<typeof UserTable>
export type InsertUser = InferInsertModel<typeof UserTable>
export const insertUserSchema = createInsertSchema(UserTable)
export const selectUserSchema = createSelectSchema(UserTable)

// Car
export const CarTable = sqliteTable('Car', {
  id: text('id').primaryKey(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  color: text('color').notNull(),
  price: real('price').notNull(),
  mileage: integer('mileage').notNull(),
  fuelType: text('fuelType').notNull(),
  transmission: text('transmission').notNull(),
})

export type Car = InferSelectModel<typeof CarTable>
export type InsertCar = InferInsertModel<typeof CarTable>
export const insertCarSchema = createInsertSchema(CarTable)
export const selectCarSchema = createSelectSchema(CarTable)

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
