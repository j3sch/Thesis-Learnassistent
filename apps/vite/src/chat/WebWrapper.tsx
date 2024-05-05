import { YStack } from 'tamagui'

export function ChatWrapper({ children }: { children: React.ReactNode }) {
  return (
    <YStack overflow='hidden' height='100dvh'>
      {children}
    </YStack>
  )
}
