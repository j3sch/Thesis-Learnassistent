import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Metadata />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
})

const Metadata = () => (
  <head>
    <meta name='viewport' content='width=device-width,initial-scale=1' />
    {/* Ensure a minimum width of 100% */}
    <style>
      {`
        body, #root {
          color-scheme: dark;
          min-width: 100% !important;
          background-color: #101010;

        }
      `}
    </style>
  </head>
)
