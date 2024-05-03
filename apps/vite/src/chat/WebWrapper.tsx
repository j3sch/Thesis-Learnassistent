import { XStack, YStack, isWeb } from 'tamagui'

export function ChatWrapper({ children }: { children: React.ReactNode }) {
    if (isWeb) {
        return (
            <XStack
                justifyContent='center'
                backgroundColor={'$backgroundTransparent'}
                overflow='hidden'
                height='100dvh'
            >
                <YStack flex={1} maxWidth={1024}>
                    {children}
                </YStack>
            </XStack>
        )
    }

    return children
}
