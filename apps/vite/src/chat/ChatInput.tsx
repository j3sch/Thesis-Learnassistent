import { Button, Input, XStack, YStack } from 'tamagui'
import { SendHorizontal } from '@tamagui/lucide-icons'
import { useRef, useState } from 'react'

export function ChatInput() {
  const [answer, setAnswer] = useState('')
  const inputRef = useRef<null>(null)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (answer.trim() === '') {
      return
    }
    // send answer
    setAnswer('')
  }

  return (
    <YStack
      backgroundColor={'$backgroundTransparent'}
      position='fixed'
      b={0}
      l={8}
      r={8}
      paddingHorizontal='$3.5'
      paddingBottom='$3'
      paddingTop='$1'
    >
      <XStack mx='auto' width={'100%'} maxWidth={768} alignItems='center' gap='$2'>
        <Input
          backgroundColor={'$background'}
          ref={inputRef}
          flex={1}
          size='$4'
          placeholder='Your answer...'
          hoverStyle={{
            borderWidth: 1,
          }}
          value={answer}
          onChangeText={setAnswer}
          onSubmitEditing={handleSubmit}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === 'Enter') {
              handleSubmit(e)
            }
          }}
        />
        <Button
          backgroundColor={'$background'}
          onPress={(e) => {
            handleSubmit(e)
            // inputRef.current?.focus()
          }}
          size='$4'
          // icon={isLoading ? <Spinner color={'$zinc50'} /> : <SendHorizontal size={'$1'} />}
          icon={<SendHorizontal size={'$1'} />}
        />
      </XStack>
    </YStack>
  )
}
