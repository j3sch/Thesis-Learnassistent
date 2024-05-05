import { ArrowLeft } from '@tamagui/lucide-icons'
import { XStack, Button, YStack } from 'tamagui'

export function Header() {
  return (
    <header>
      <YStack
        zIndex={10}
        backgroundColor={'$backgroundTransparent'}
        alignItems='center'
        height={80}
        //@ts-ignore
        position='fixed'
        t={0}
        l={8}
        r={8}
        paddingHorizontal='$3.5'
        justifyContent='center'
      >
        <XStack width='100%' height={'100%'} maxWidth={768} alignItems='center' gap='$5'>
          <Button circular size='$4' icon={<ArrowLeft />} />
          <XStack
            flex={1}
            maxWidth={500}
            backgroundColor={'$color3'}
            height={12}
            mx='auto'
            borderRadius={'$10'}
          >
            <XStack width={'67%'} backgroundColor={'#3CB179'} borderRadius={'$10'} />
          </XStack>
        </XStack>
      </YStack>
    </header>
  )
}
