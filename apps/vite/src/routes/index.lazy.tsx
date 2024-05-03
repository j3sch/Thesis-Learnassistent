import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Button, YStack } from 'tamagui'
import { Airplay } from '@tamagui/lucide-icons'

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
