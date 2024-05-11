import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Style />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
})

const Style = () => (
  <style>
    {`
        body, #root {
          color-scheme: dark;
          min-width: 100% !important;
          background-color: #101010;

        }
      `}
  </style>
)
