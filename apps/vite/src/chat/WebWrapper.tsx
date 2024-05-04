import { XStack, YStack, isWeb } from 'tamagui'

export function ChatWrapper({ children }: { children: React.ReactNode }) {
    return (
        <YStack overflow='hidden' height='100dvh'>
            {children}
        </YStack>
    )
}
