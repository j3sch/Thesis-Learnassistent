import { Button, Form, Input, XStack, YStack } from 'tamagui'
import { SendHorizontal } from '@tamagui/lucide-icons'
import { useRef, useState } from 'react'
import { useChatActions } from './store'
import { useChat } from 'ai/react'

export function ChatInput() {
    const [answer, setAnswer] = useState('')
    const inputRef = useRef<null>(null)
    const { addChat } = useChatActions()
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: `${import.meta.env.VITE_PUBLIC_API_URL}/sse`,
    })

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
        >
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
