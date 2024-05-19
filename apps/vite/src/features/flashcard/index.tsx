import { SourceButtomSheet } from '@/features/shared/SourceButtomSheet'
import { useFlashcardIndex } from '@/atoms/flashcard'
import { Header } from '@/features/shared/Header'
import { Button, SizableText, XStack, YStack } from 'tamagui'
import { useEffect, useState } from 'react'
import { trpc } from '@/utils/trpc'
import type { Card } from 'dolphinsr'
import { TRating } from '@t4/types'
import { useNavigate } from '@tanstack/react-router'
import { getNextCard, initCards, reviewCard } from './fsrs'
import { Grade, Rating } from 'ts-fsrs'

export function FlashcardScreen() {
  const [flashcardIndex] = useFlashcardIndex()
  const [showSolution, setShowSolution] = useState(false)
  const [flashcard, setFlashcard] = useState<Card>(null)
  const navigate = useNavigate({ from: '/flashcard' })

  useEffect(() => {
    setFlashcard(initCards())
  }, [])

  // const { data } = trpc.assistant.getExercise.useQuery(
  //     {
  //         exercise_id: flashcardIndex,
  //     },
  //     {
  //         refetchOnMount: false,
  //     }
  // )

  function handleReview(rating: Grade) {
    reviewCard(rating, flashcard.id)
    setShowSolution(false)
    const nextCard = getNextCard()
    if (!nextCard) {
      navigate({ to: '/chat' })
    }
    setFlashcard(nextCard)
  }

  return (
    <>
      <Header exerciseIndex={flashcardIndex} />
      <YStack
        width={'100%'}
        position='fixed'
        bottom={90}
        top={80}
        right={0}
        left={0}
        flex={1}
        paddingHorizontal={16}
        paddingVertical={8}
      >
        <YStack
          backgroundColor={'$color3'}
          maxWidth={768}
          mx='auto'
          flex={1}
          width={'100%'}
          borderRadius={'$7'}
          alignItems='center'
          padding={24}
          gap={'$3'}
        >
          <SizableText size={'$7'}>{flashcard?.question}</SizableText>
          {showSolution && (
            <YStack
              paddingTop={'$3'}
              borderTopColor={'$color8'}
              borderTopWidth={'1'}
              width={'100%'}
              flex={1}
              alignItems='center'
            >
              <SizableText size={'$7'}>{flashcard?.answer}</SizableText>
            </YStack>
          )}
        </YStack>
      </YStack>
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
      <SourceButtomSheet />
    </>
  )
}
