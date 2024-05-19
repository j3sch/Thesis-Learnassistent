import { YStack } from 'tamagui'

export function WebWrapper({ children }: { children: React.ReactNode }) {
  return (
    <YStack overflow='hidden' height='100dvh'>
      {children}
    </YStack>
  )
}
