import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { TamaguiProvider } from 'tamagui'
import '@tamagui/core/reset.css'

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

// Render the app
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <TamaguiProvider config={config} defaultTheme='light'>
                <RouterProvider router={router} />
            </TamaguiProvider>
        </StrictMode>
    )
}
