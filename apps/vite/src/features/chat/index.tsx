import { ChatInput } from './ChatInput'
import { ChatScrollView } from './Scrollview'
import { Header } from '../shared/Header'
import { useChat } from 'ai/react'
import { useExerciseIndex } from '@/atoms/exercise'
import { useEffect, useState } from 'react'
import { SourceButtomSheet } from '../shared/SourceButtomSheet'

export function ChatScreen() {
  const [exerciseIndex] = useExerciseIndex()
  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({})

  const chat = useChat({
    api: `${import.meta.env.VITE_PUBLIC_API_URL}/assistant-sse`,
    body: {
      exercise_id: exerciseIndex,
    },
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources')
      const sources = sourcesHeader
        ? JSON.parse(Buffer.from(sourcesHeader, 'base64').toString('utf8'))
        : []
      const messageIndexHeader = response.headers.get('x-message-index')
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({ ...sourcesForMessages, [messageIndexHeader]: sources })
      }
    },
    onError: (e) => {
      console.error(e)
    },
  })

  useEffect(() => {
    console.log(sourcesForMessages)
  }, [sourcesForMessages])

  return (
    <>
      <Header exerciseIndex={exerciseIndex} />
      <ChatScrollView chat={chat} />
      <ChatInput chat={chat} />
      <SourceButtomSheet />
    </>
  )
}
