import { ChatItem } from './ChatItem'
import { VirtualList } from './VirtualList'

export function ChatScrollView() {
  return (
    <VirtualList
      data={[
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },

        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },

        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },

        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },

        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },

        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },

        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },

        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },

        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
        // { id: 1, source: 'Hello', solution: 'Hi' },
      ]}
      itemHeight={190}
      renderItem={(item) => <ChatItem key={item.id} item={item} />}
    />
  )
}
