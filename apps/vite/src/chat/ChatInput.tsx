import { Button, Form, Input, XStack, YStack } from 'tamagui'
import { SendHorizontal } from '@tamagui/lucide-icons'
import { useRef } from 'react'
import { UseChatHelpers } from 'ai/react'
import { useExerciseIndex } from '../atoms/exercise'

export function ChatInput({ chat }: { chat: UseChatHelpers }) {
    const { input, handleSubmit, handleInputChange } = chat
    const inputRef = useRef<null>(null)
    const [exerciseIndex, setExerciseIndex] = useExerciseIndex()
    // const handleSubmit = (e: any) => {
    //     e.preventDefault()
    //     if (answer.trim() === '') {
    //         return
    //     }
    //     const body = {
    //         text: answer,
    //         type: 'user',
    //     }

    //     mutate(body, {
    //         onSuccess: (data) => {
    //             addChat
    //         },
    //     })
    //     // send answer
    //     setAnswer('')
    // }

    return (
        <YStack
            backgroundColor={'$backgroundTransparent'}
            //@ts-ignore
            position='fixed'
            b={0}
            l={8}
            r={8}
            paddingHorizontal='$3.5'
            paddingBottom='$3'
            paddingTop='$1'
            gap='$3'
        >
            <XStack maxWidth={768} mx='auto' width={'100%'} alignItems='center' gap='$2'>
                <Button
                    variant='outlined'
                    //@ts-ignore
                    onPress={handleSubmit}
                    size='$3.5'
                    // icon={isLoading ? <Spinner color={'$zinc50'} /> : <SendHorizontal size={'$1'} />}
                >
                    Gib mir ein Hinweis
                </Button>
                <Button
                    onPressOut={() => setExerciseIndex(exerciseIndex + 1)}
                    variant='outlined'
                    //@ts-ignore
                    onPress={handleSubmit}
                    size='$3.5'
                    // icon={isLoading ? <Spinner color={'$zinc50'} /> : <SendHorizontal size={'$1'} />}
                >
                    Nächste Aufgabe
                </Button>
            </XStack>
            <Form
                flexDirection='row'
                //@ts-ignore
                onSubmit={handleSubmit}
                mx='auto'
                width={'100%'}
                maxWidth={768}
                alignItems='center'
                gap='$2'
            >
                <Input
                    backgroundColor={'$background'}
                    ref={inputRef}
                    flex={1}
                    size='$4'
                    placeholder='Your answer...'
                    hoverStyle={{
                        borderWidth: 1,
                    }}
                    value={input}
                    //@ts-ignore
                    onChange={handleInputChange}
                    // onSubmitEditing={handleSubmit}
                    // onKeyPress={(e) => {
                    //     if (e.nativeEvent.key === 'Enter') {
                    //         handleSubmit(e)
                    //     }
                    // }}
                />
                <Button
                    backgroundColor={'$background'}
                    //@ts-ignore
                    onPress={handleSubmit}
                    size='$4'
                    // icon={isLoading ? <Spinner color={'$zinc50'} /> : <SendHorizontal size={'$1'} />}
                    icon={<SendHorizontal size={'$1'} />}
                />
            </Form>
        </YStack>
    )
}
