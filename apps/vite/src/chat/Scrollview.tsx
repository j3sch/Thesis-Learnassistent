import { UseChatHelpers } from 'ai/react'
import { trpc } from '../utils/trpc'
import { ChatItem } from './ChatItem'
import { VirtualList } from './VirtualList'
import { useEffect } from 'react'

export function ChatScrollView({ chat }: { chat: UseChatHelpers }) {
  const { messages, setMessages } = chat

  const { data, isSuccess } = trpc.assistant.getNextExercise.useQuery(
    {
      exercise_id: 1,
    },
    {
      refetchOnMount: false,
    }
  )

  useEffect(() => {
    if (isSuccess && data) {
      setMessages([{ role: 'assistant', content: data.question, id: '1' }])
    }
  }, [data])

  return (
    <VirtualList
      data={messages}
      itemHeight={190}
      renderItem={(item, index) => <ChatItem key={item.id} item={item} index={index} />}
    />
  )
}
