import { createLazyFileRoute } from '@tanstack/react-router'
import { WebWrapper } from '@/features/chat/WebWrapper'
import { ChatScreen } from '@/features/chat'

export const Route = createLazyFileRoute('/chat')({
  component: Chat,
})

function Chat() {
  return (
    <WebWrapper>
      <ChatScreen />
    </WebWrapper>
  )
}
