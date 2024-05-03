import { RouterProvider, createRouter } from '@tanstack/react-router'
import { TamaguiProvider } from 'tamagui'
import '@tamagui/core/reset.css'
import { trpc } from './utils/trpc'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import superJson from 'superjson'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Import tamagui config
import config from './tamagui.config'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Rende

export function App() {
    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() =>
        trpc.createClient({
            transformer: superJson,
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' && opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
                }),
            ],
        })
    )

    return (
        <TamaguiProvider config={config} defaultTheme='dark'>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </trpc.Provider>
        </TamaguiProvider>
    )
}
