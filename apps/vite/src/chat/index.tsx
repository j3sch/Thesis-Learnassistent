import { YStack } from 'tamagui'
import { ChatInput } from './ChatInput'
import { ChatScrollView } from './Scrollview'

export function ChatScreen() {
  const ChatView = () => (
    <YStack flex={1}>
      <ChatScrollView />
      <ChatInput />
    </YStack>
  )

  return <ChatView />
}
