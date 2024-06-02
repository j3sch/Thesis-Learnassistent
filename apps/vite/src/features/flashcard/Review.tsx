import { Button, XStack, YStack } from 'tamagui'
import { Dispatch } from 'react'
import { Grade, Rating } from 'ts-fsrs'
import { SetStateAction } from 'jotai'

interface Props {
  handleReview: (rating: Grade) => void
  showSolution: boolean
  setShowSolution: Dispatch<SetStateAction<boolean>>
}

export function Review(props: Props) {
  const { handleReview, showSolution, setShowSolution } = props

  return (
    <YStack
      position='fixed'
      left={0}
      right={0}
      bottom={0}
      height={90}
      paddingHorizontal={16}
      paddingVertical={8}
      justifyContent='center'
      alignItems='center'
    >
      {showSolution ? (
        <XStack
          backgroundColor={'$color3'}
          maxWidth={768}
          mx='auto'
          flex={1}
          width={'100%'}
          borderRadius={'$7'}
          alignItems='center'
          gap={'$3'}
          paddingHorizontal={8}
          paddingVertical={8}
        >
          <Button
            theme={'red'}
            flex={1}
            height={'100%'}
            borderRadius={13}
            onPress={() => handleReview(Rating.Again)}
          >
            Nochmal
          </Button>
          <Button
            theme={'yellow'}
            flex={1}
            height={'100%'}
            borderRadius={13}
            onPress={() => handleReview(Rating.Hard)}
          >
            Schwer
          </Button>
          <Button
            theme={'green'}
            flex={1}
            height={'100%'}
            borderRadius={13}
            onPress={() => handleReview(Rating.Good)}
          >
            Gut
          </Button>
          <Button
            theme={'blue'}
            flex={1}
            height={'100%'}
            borderRadius={13}
            onPress={() => handleReview(Rating.Easy)}
          >
            Einfach
          </Button>
        </XStack>
      ) : (
        <Button onPress={() => setShowSolution(true)} size={'$5'} chromeless>
          Zeige Antwort
        </Button>
      )}
    </YStack>
  )
}
