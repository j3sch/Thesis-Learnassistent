import { assistantRouter } from './routes/assistant'
import { authRouter } from './routes/auth'
import { carsRouter } from './routes/cars'
import { helloRouter } from './routes/hello'
import { userRouter } from './routes/user'
import { router } from './trpc'

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  auth: authRouter,
  car: carsRouter,
  assistant: assistantRouter,
})

export type AppRouter = typeof appRouter
