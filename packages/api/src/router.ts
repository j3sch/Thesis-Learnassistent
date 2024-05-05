import { assistantRouter } from './routes/assistant'

import { router } from './trpc'

export const appRouter = router({
  assistant: assistantRouter,
})

export type AppRouter = typeof appRouter
