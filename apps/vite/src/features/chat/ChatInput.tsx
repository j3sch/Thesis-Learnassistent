import { Button, Form, Input, Spinner, XStack, YStack } from 'tamagui'
import { SendHorizontal } from '@tamagui/lucide-icons'
import { useEffect, useRef, useState } from 'react'
import { UseChatHelpers } from 'ai/react'
import { useExerciseIndex } from '@/atoms/chat'
import { useNavigate } from '@tanstack/react-router'
import { useProgressIndex } from '@/atoms/chat'

interface Props {
  chat: UseChatHelpers
}

export function ChatInput(props: Props) {
  const { chat } = props
  const { input, messages, handleSubmit, handleInputChange, setMessages, append, data, isLoading } = chat
  const inputRef = useRef<HTMLInputElement>(null)
  const [exerciseIndex, setExerciseIndex] = useExerciseIndex()
  const [progressIndex, setProgressIndex] = useProgressIndex()
  const navigate = useNavigate({ from: '/chat' })
  const [isExerciseComplete, setIsExerciseComplete] = useState(false)

  function handleNextExercise() {
    if (messages.length !== 0) {
      setProgressIndex(progressIndex + 1)
    }
    setExerciseIndex(exerciseIndex + 2)
    setMessages([])
    inputRef.current?.focus()
    setIsExerciseComplete(false)
    if (progressIndex >= 9) {
      setProgressIndex(1)
      setExerciseIndex(2)
      navigate({ to: '/' })
    }
  }

  function handleHint() {
    append({ role: 'user', content: 'Gib mir ein Hinweis!' })
  }

  useEffect(() => {
    console.log("isLoading", isLoading)
    if (!data || isLoading) return
    const numberOfUserMessages = messages.length/ 2
    const dataThisExercise = data.slice(-numberOfUserMessages)
    // @ts-ignore
    const hasIsCorrectInside = dataThisExercise.some(obj => obj?.isCorrect)
    setIsExerciseComplete(hasIsCorrectInside)
  }, [data, isLoading])

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
          size='$3.5'
          onPress={handleHint}
        >
          Gib mir ein Hinweis
        </Button>
        <Button
          disabledStyle={{
            opacity: 0.5,
          }}
          disabled={messages.length === 0 || isLoading}
          onPress={handleNextExercise}
          variant={'outlined'}
          theme={isExerciseComplete ? 'green' : 'dark'}
          //@ts-ignore
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
          autoFocus
          backgroundColor={'$background'}
          ref={inputRef}
          flex={1}
          size='$4'
          placeholder='Your answer...'
          hoverStyle={{
            borderWidth: 1,
          }}
          blurOnSubmit={false}
          value={input}
          //@ts-ignore
          onChange={handleInputChange}
          //@ts-ignore
          onSubmitEditing={handleSubmit}
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
