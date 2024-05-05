import { ChatInput } from './ChatInput'
import { ChatScrollView } from './Scrollview'
import { Header } from './Header'
import { useChat } from 'ai/react'

export function ChatScreen() {
    const chat = useChat({
        api: `${import.meta.env.VITE_PUBLIC_API_URL}/assistant-sse`,
    })

    return (
        <>
            <Header />
            <ChatScrollView chat={chat} />
            <ChatInput chat={chat} />
        </>
    )
}
