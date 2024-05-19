import { H5, Paragraph, XStack, YStack } from 'tamagui'

export const ChatItem = (props: { item: any; index: number }) => {
  const { item, index } = props

  return (
    <>
      <YStack maxWidth={768} my={'$1.5'}>
        {index === 0 && (
          <H5
            lineHeight={30}
            width={'90%'}
            fontSize={20}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        )}
        {item.role === 'user' && (
          <XStack
            alignSelf='flex-end'
            borderRadius={'$5'}
            paddingHorizontal='$3'
            paddingVertical='$2'
            maxWidth={'85%'}
            backgroundColor={'$color3'}
            flexWrap='wrap'
          >
            <Paragraph fontSize={16}>{item.content}</Paragraph>
          </XStack>
        )}
        {index !== 0 && item.role === 'assistant' && (
          <Paragraph fontSize={16}>{item.content}</Paragraph>
        )}
      </YStack>
    </>
  )
}
