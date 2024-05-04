import { H5, Paragraph, XStack, YStack } from 'tamagui'

export const ChatItem = (props: { item: any; index: number }) => {
    const { item, index } = props

    return (
        <>
            <YStack maxWidth={768} my={'$1.5'}>
                {index === 0 && (
                    <H5 lineHeight={30} fontSize={20}>
                        {item.text}
                    </H5>
                )}
                {item.type === 'user' && (
                    <XStack
                        alignSelf='flex-end'
                        borderRadius={'$5'}
                        paddingHorizontal='$3'
                        paddingVertical='$2'
                        maxWidth={'85%'}
                        backgroundColor={'$color3'}
                        flexWrap='wrap'
                    >
                        <Paragraph fontSize={16}>{item.text}</Paragraph>
                    </XStack>
                )}
                {index !== 0 && item.type === 'assistant' && <Paragraph fontSize={16}>{item.text}</Paragraph>}
            </YStack>
        </>
    )
}
