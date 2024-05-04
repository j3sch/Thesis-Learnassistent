import { createLazyFileRoute, Link } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div
      style={{
        display: 'flex',
        padding: '1rem',
        gap: '1rem',
      }}
    >
      <Link to='/' className='[&.active]:font-bold'>
        Home
      </Link>{' '}
      <Link to='/chat' className='[&.active]:font-bold'>
        Chat
      </Link>
    </div>
  )
}
