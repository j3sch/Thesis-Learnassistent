import { Paragraph, YStack } from 'tamagui'

export const ChatItem = ({ item }: { item: any }) => {
    return (
        <>
            <YStack gap='$2' maxWidth={768}>
                <Paragraph fontSize={16} maxWidth={'85%'}>
                    {item.source}
                </Paragraph>

                {item.solution && (
                    <Paragraph fontSize={16} color={'#34d399'}>
                        {item.solution}
                    </Paragraph>
                )}
            </YStack>
        </>
    )
}
