import { ChatItem } from './ChatItem'
import { InvertedVirtualList } from './InvertedVirtualList'

export function ChatScrollView() {
    return (
        <InvertedVirtualList
            data={[{ id: 1, source: 'Hello', solution: 'Hi' }]}
            itemHeight={190}
            renderItem={(item) => <ChatItem key={item.id} item={item} />}
        />
    )
}
