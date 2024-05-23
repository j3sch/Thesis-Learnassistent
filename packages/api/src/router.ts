import { exerciseRouter } from './routes/exercise'

import { router } from './trpc'

export const appRouter = router({
  exercise: exerciseRouter,
})

export type AppRouter = typeof appRouter
