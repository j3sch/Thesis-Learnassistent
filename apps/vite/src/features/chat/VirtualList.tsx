import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useEffect } from 'react'

interface Props {
  data: any[]
  renderItem: (item: any, rowVirtualizer: any) => React.ReactNode
  itemHeight: number
}

export const VirtualList = ({ data, renderItem, itemHeight }: Props): React.ReactNode => {
  const parentRef = useRef()
  const count = data?.length
  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current as any,
    estimateSize: () => itemHeight,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (rowVirtualizer) {
      rowVirtualizer.scrollToOffset(rowVirtualizer?.getTotalSize())
    }
  }, [rowVirtualizer.getTotalSize()])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 112,
        top: 0,
        left: 8,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
    >
      <div
        ref={parentRef as any}
        style={{
          paddingTop: 88,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,

          width: '100%',
          overflowY: 'scroll', // Make it scroll!
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* The large inner element to hold all of the items */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            maxWidth: 768,
            width: '100%',
            position: 'relative',
          }}
        >
          {/* Only the visible items in the virtualizer, manually positioned to be in view */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(data[virtualItem.index], virtualItem.index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
