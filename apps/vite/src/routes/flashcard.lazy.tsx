import { createLazyFileRoute } from '@tanstack/react-router'
import { WebWrapper } from '@/features/chat/WebWrapper'
import { FlashcardScreen } from '@/features/flashcard'

export const Route = createLazyFileRoute('/flashcard')({
  component: Flashcard,
})

function Flashcard() {
  return (
    <WebWrapper>
      <FlashcardScreen />
    </WebWrapper>
  )
}
