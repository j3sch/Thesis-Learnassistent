import { createLazyFileRoute } from '@tanstack/react-router'
import { ChatWrapper } from '../chat/WebWrapper'
import { ChatScreen } from '../chat'

export const Route = createLazyFileRoute('/chat')({
    component: About,
})

function About() {
    return (
        <ChatWrapper>
            <ChatScreen />
        </ChatWrapper>
    )
}
