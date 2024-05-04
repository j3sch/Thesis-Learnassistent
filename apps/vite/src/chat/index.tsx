import { YStack } from 'tamagui'
import { ChatInput } from './ChatInput'
import { ChatScrollView } from './Scrollview'
import { Header } from './Header'

export function ChatScreen() {
    const ChatView = () => (
        <>
            <Header />
            <ChatScrollView />
            <ChatInput />
        </>
    )

    return <ChatView />
}
