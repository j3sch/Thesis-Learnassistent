import { H5, SizableText, YStack } from 'tamagui'
import { ExerciseWithSource } from '@t4/types/src'

interface Props {
    exercise?: ExerciseWithSource
    showSolution: boolean
}

export function Card(props: Props) {
    const { exercise, showSolution } = props

    return (
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
                {exercise && <SizableText size={'$7'} dangerouslySetInnerHTML={{ __html: exercise.question }} />}
                {showSolution && (
                    <YStack
                        paddingTop={'$3'}
                        borderTopColor={'$color8'}
                        borderTopWidth={'1'}
                        width={'100%'}
                        flex={1}
                        alignItems='center'
                    >
                        <SizableText size={'$7'}>{exercise?.conciseAnswer}</SizableText>
                    </YStack>
                )}
            </YStack>
        </YStack>
    )
}
