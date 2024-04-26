import { StyleSheet } from 'react-native'

import { trpc } from '@/utils/trpc'
import { Paragraph, YStack } from 'tamagui'

export default function TabOneScreen() {
    const { data } = trpc.hello.world.useQuery<string>('world')

    return (
        <YStack backgroundColor={'$background'} f={1} justifyContent='center'>
            <Paragraph>{data}</Paragraph>
        </YStack>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
})
