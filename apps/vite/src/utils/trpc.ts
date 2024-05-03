import type { AppRouter } from '@t4/api/src/router'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()
