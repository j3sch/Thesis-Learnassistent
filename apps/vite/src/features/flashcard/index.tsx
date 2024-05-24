import { SourceButtomSheet } from '@/features/shared/SourceButtomSheet'
import { Header } from '@/features/shared/Header'
import { Button, SizableText, XStack, YStack } from 'tamagui'
import { useEffect, useState } from 'react'
import { trpc } from '@/utils/trpc'
import { useNavigate } from '@tanstack/react-router'
import { getNextCard, reviewCard } from './fsrs'
import { Grade, Rating } from 'ts-fsrs'
import { useProgressFlashcardIndex } from '@/atoms/flashcard'
import { Review } from './Review'
import { Card } from './Card'

export function FlashcardScreen() {
    const [showSolution, setShowSolution] = useState(false)
    const [flashcardIndex, setFlashcardIndex] = useState<number>(1)
    const navigate = useNavigate({ from: '/flashcard' })
    const [isNewCard, setIsNewCard] = useState(true)
    const [progressIndex, setProgressIndex] = useProgressFlashcardIndex()

    const { data } = trpc.exercise.get.useQuery({
        id: flashcardIndex,
        isNewCard: isNewCard,
    })

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (data?.orderIndex === 1) {
            setFlashcardIndex(1)
        }
    }, [data?.orderIndex])

    useEffect(() => {
        const nextCard = getNextCard()
        if (nextCard) {
            setFlashcardIndex(nextCard.id)
        }
    }, [])

    function handleReview(rating: Grade) {
        reviewCard(rating, flashcardIndex)
        setShowSolution(false)
        const nextCard = getNextCard()
        setProgressIndex(progressIndex + 1)
        if (!nextCard || progressIndex >= 9) {
            setProgressIndex(9)
            setFlashcardIndex(1)
            navigate({ to: '/chat' })
            return
        }
        setIsNewCard(nextCard.isNewCard)
        setFlashcardIndex(nextCard.id)
    }

    return (
        <>
            <Header exerciseIndex={progressIndex} />
            <Card exercise={data} showSolution={showSolution} />
            <Review
                handleReview={handleReview}
                showSolution={showSolution}
                setShowSolution={setShowSolution}
                flashcardIndex={flashcardIndex}
                setFlashcardIndex={setFlashcardIndex}
            />
            <SourceButtomSheet />
        </>
    )
}
