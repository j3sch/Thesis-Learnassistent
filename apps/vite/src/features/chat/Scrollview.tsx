import { UseChatHelpers } from 'ai/react'
import { ChatItem } from './ChatItem'
import { VirtualList } from './VirtualList'
import { Exercise, Source } from '@t4/api/src/db/schema'
import { ExerciseWithSource } from '@t4/types'

interface Props {
  chat: UseChatHelpers
  exercise?: ExerciseWithSource
}

export function ChatScrollView(props: Props) {
  const { chat, exercise } = props
  const { messages } = chat

  return (
    <VirtualList
      data={[{ role: 'assistant', content: exercise?.question, id: '1' }, ...messages]}
      itemHeight={190}
      renderItem={(item, index) => <ChatItem key={item.id} item={item} index={index} />}
    />
  )
}
