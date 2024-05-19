import { UseIsInfoSheetOpen } from '@/atoms/infoSheet'
import { ArrowLeft, Info, X } from '@tamagui/lucide-icons'
import { XStack, Button, YStack } from 'tamagui'
import { Link } from '@tanstack/react-router'

interface Props {
  exerciseIndex: number
}

export function Header(props: Props) {
  const { exerciseIndex } = props
  const [open, setOpen] = UseIsInfoSheetOpen()

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
        <XStack
          width='100%'
          height={'100%'}
          maxWidth={768}
          justifyContent='space-evenly'
          alignItems='center'
          gap='$5'
        >
          <Link to='/'>
            <Button circular size='$4' icon={<X />} />
          </Link>
          <XStack
            flex={1}
            maxWidth={500}
            backgroundColor={'$color3'}
            height={12}
            mx='auto'
            borderRadius={'$10'}
          >
            <XStack
              width={`${exerciseIndex * 10}%`}
              backgroundColor={'#3CB179'}
              borderRadius={'$10'}
            />
          </XStack>
          <Button circular size='$4' onPress={() => setOpen(true)} icon={<Info />} />
        </XStack>
      </YStack>
    </header>
  )
}
