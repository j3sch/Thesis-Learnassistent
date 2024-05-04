import { ChatItem } from './ChatItem'
import { VirtualList } from './VirtualList'

export function ChatScrollView() {
    return (
        <VirtualList
            data={[
                { type: 'assistant', text: 'Hello! How can I help you today?', id: '1' },
                { type: 'user', text: 'I need help with my order.', id: '2' },
                { type: 'assistant', text: 'Sure! What is your order number?', id: '3' },
                { type: 'user', text: '123456', id: '4' },
                { type: 'assistant', text: 'Thank you! One moment please.', id: '5' },
            ]}
            itemHeight={190}
            renderItem={(item, index) => <ChatItem key={item.id} item={item} index={index} />}
        />
    )
}
