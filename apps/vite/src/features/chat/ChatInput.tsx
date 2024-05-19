import { Button, Form, Input, XStack, YStack } from 'tamagui'
import { SendHorizontal } from '@tamagui/lucide-icons'
import { useEffect, useRef, useState } from 'react'
import { UseChatHelpers } from 'ai/react'
import { useExerciseIndex } from '@/atoms/exercise'
import { useNavigate } from '@tanstack/react-router'

export function ChatInput({ chat }: { chat: UseChatHelpers }) {
  const { input, handleSubmit, handleInputChange, setMessages, append, data } = chat
  const inputRef = useRef<null>(null)
  const [exerciseIndex, setExerciseIndex] = useExerciseIndex()
  const navigate = useNavigate({ from: '/chat' })
  const [isExerciseComplete, setIsExerciseComplete] = useState(false)

  function handleNextExercise() {
    setExerciseIndex(exerciseIndex + 1)
    setMessages([])
    setIsExerciseComplete(false)
    if (exerciseIndex >= 9) {
      setExerciseIndex(1)
      navigate({ to: '/' })
    }
  }

  function handleHint() {
    append({ role: 'user', content: 'Gib mir ein Hinweis!' })
  }

  useEffect(() => {
    if (!data || !data[0]) return

    const obj = data[0]
    if (typeof obj === 'object' && 'isCorrect' in obj) {
      console.log('isCorrect', obj.isCorrect)
      const isCorrect = JSON.parse(obj.isCorrect)
      setIsExerciseComplete(isCorrect)
    }
  }, [data])

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
          // icon={isLoading ? <Spinner color={'$zinc50'} /> : <SendHorizontal size={'$1'} />}
        >
          Gib mir ein Hinweis
        </Button>
        <Button
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
