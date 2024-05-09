import { UseChatHelpers } from 'ai/react'
import { trpc } from '../utils/trpc'
import { ChatItem } from './ChatItem'
import { VirtualList } from './VirtualList'
import { useExerciseIndex } from '../atoms/exercise'

export function ChatScrollView({ chat }: { chat: UseChatHelpers }) {
    const { messages } = chat
    const [exerciseIndex] = useExerciseIndex()

    const { data } = trpc.assistant.getNextExercise.useQuery(
        {
            exercise_id: exerciseIndex,
        },
        {
            refetchOnMount: false,
        }
    )

    return (
        <VirtualList
            data={[{ role: 'assistant', content: data?.question, id: '1' }, ...messages]}
            itemHeight={190}
            renderItem={(item, index) => <ChatItem key={item.id} item={item} index={index} />}
        />
    )
}
