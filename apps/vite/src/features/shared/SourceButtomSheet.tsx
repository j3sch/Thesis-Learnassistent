import { Anchor, Button, H3, H5, Label, Paragraph, Sheet, XStack, YStack, Image } from 'tamagui'
import React, { useState } from 'react'
import { UseIsInfoSheetOpen } from '@/atoms/infoSheet'
import { trpc } from '@/utils/trpc'
import { useExerciseIndex } from '@/atoms/chat'
import { Exercise, Source } from '@t4/api/src/db/schema'
import { ExerciseWithSource } from '@t4/types'

interface Props {
  exercise?: ExerciseWithSource
}

export const SourceButtomSheet = (props: Props): React.ReactNode => {
  const { exercise } = props
  const [open, setOpen] = UseIsInfoSheetOpen()
  const [position, setPosition] = useState(0)

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[380]}
        snapPointsMode='constant'
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
        animation='quick'
        modal
      >
        <Sheet.Overlay
          backgroundColor={'$color1'}
          animation='quick'
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame
          backgroundColor={'$color3'}
          padding='$5'
          gap='$5'
          flex={1}
          maxWidth={768}
          mx='auto'
        >
          <H5>Quelle</H5>
          <YStack flex={1} width={'100%'} justifyContent='flex-start' gap='$2.5'>
            {exercise?.title && (
              <XStack gap='$2.5'>
                <Paragraph>Titel:</Paragraph>
                <Paragraph>{exercise.title}</Paragraph>
              </XStack>
            )}
            {exercise?.author && (
              <XStack gap='$2.5'>
                <Paragraph>Autor:</Paragraph>
                <Paragraph>{exercise.author}</Paragraph>
              </XStack>
            )}
            {exercise?.date && (
              <XStack gap='$2.5'>
                <Paragraph>Datum:</Paragraph>
                <Paragraph>{exercise.date}</Paragraph>
              </XStack>
            )}
            {exercise?.publisher && (
              <XStack gap='$2.5'>
                <Paragraph>Herausgeber:</Paragraph>
                <Paragraph>{exercise.publisher}</Paragraph>
              </XStack>
            )}
            {exercise?.img && (
              <Image
      source={{
        uri: exercise.img,
        
        
      }}
      width={190}
      height={66.5}
      objectFit='contain'

    />
              )}
            {exercise?.url && (
              <XStack gap='$2.5'>
                <Paragraph>URL:</Paragraph>
                <Anchor href={exercise.url}>{exercise.url}</Anchor>
              </XStack>
            )}
            {exercise?.accessedOn && (
              <XStack gap='$2.5'>
                <Paragraph>Zugegriffen am:</Paragraph>
                <Paragraph>{exercise.accessedOn}</Paragraph>
              </XStack>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
