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
      <Link to='/flashcard' className='[&.active]:font-bold'>
        Karteikartensystem
      </Link>
      <Link to='/chat' className='[&.active]:font-bold'>
        Lernassistent
      </Link>
    </div>
  )
}
