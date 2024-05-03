import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useEffect } from 'react'

interface Props {
    data: any[]
    renderItem: (item: any, rowVirtualizer: any) => React.ReactNode
    itemHeight: number
}

export const InvertedVirtualList = ({ data, renderItem, itemHeight }: Props): React.ReactNode => {
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
    }, [])

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 60,
                top: 52,
                left: 0,
                right: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}
        >
            <div
                ref={parentRef as any}
                style={{
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 16,
                    paddingRight: 16,
                    maxWidth: 1024,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    overflow: 'auto', // Make it scroll!
                }}
            >
                {/* The large inner element to hold all of the items */}
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
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
                            {renderItem(data[virtualItem.index], rowVirtualizer)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
