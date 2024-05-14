import { Anchor, Button, H3, H5, Label, Paragraph, Sheet, XStack, YStack } from 'tamagui'
import React, { useState } from 'react'
import { UseIsInfoSheetOpen } from '@/atoms/infoSheet'
import { trpc } from '@/utils/trpc'
import { useExerciseIndex } from '@/atoms/exercise'
import { X } from '@tamagui/lucide-icons'

export const InfoButtomSheet = (): React.ReactNode => {
    const [open, setOpen] = UseIsInfoSheetOpen()
    const [position, setPosition] = useState(0)
    const [exerciseIndex] = useExerciseIndex()

    const { data } = trpc.assistant.getNextExercise.useQuery(
        {
            exercise_id: exerciseIndex,
        },
        {
            refetchOnMount: false,
        }
    )

    return (
        <>
            <Sheet
                open={open}
                onOpenChange={setOpen}
                snapPoints={[320]}
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
                <Sheet.Frame backgroundColor={'$color3'} padding='$5' gap='$5' flex={1} maxWidth={768} mx='auto'>
                    <H5>Quelle</H5>
                    <YStack flex={1} width={'100%'} justifyContent='flex-start' gap='$2.5'>
                        {data?.title && (
                            <XStack gap='$2.5'>
                                <Paragraph>Titel:</Paragraph>
                                <Paragraph>{data.title}</Paragraph>
                            </XStack>
                        )}
                        {data?.author && (
                            <XStack gap='$2.5'>
                                <Paragraph>Autor:</Paragraph>
                                <Paragraph>{data.author}</Paragraph>
                            </XStack>
                        )}
                        {data?.date && (
                            <XStack gap='$2.5'>
                                <Paragraph>Datum:</Paragraph>
                                <Paragraph>{data.date}</Paragraph>
                            </XStack>
                        )}
                        {data?.publisher && (
                            <XStack gap='$2.5'>
                                <Paragraph>Herausgeber:</Paragraph>
                                <Paragraph>{data.publisher}</Paragraph>
                            </XStack>
                        )}
                        {data?.url && (
                            <XStack gap='$2.5'>
                                <Paragraph>URL:</Paragraph>
                                <Anchor href={data.url}>{data.url}</Anchor>
                            </XStack>
                        )}
                        {data?.accessedOn && (
                            <XStack gap='$2.5'>
                                <Paragraph>Zugegriffen am:</Paragraph>
                                <Paragraph>{data.accessedOn}</Paragraph>
                            </XStack>
                        )}
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </>
    )
}
