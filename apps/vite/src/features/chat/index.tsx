import { ChatInput } from './ChatInput'
import { ChatScrollView } from './Scrollview'
import { Header } from '../shared/Header'
import { useChat } from 'ai/react'
import { useExerciseIndex } from '@/atoms/chat'
import { useEffect, useState } from 'react'
import { SourceButtomSheet } from '../shared/SourceButtomSheet'
import { useProgressIndex } from '@/atoms/chat'
import { trpc } from '@/utils/trpc'

export function ChatScreen() {
  const [exerciseIndex, setExerciseIndex] = useExerciseIndex()
  const [progressIndex] = useProgressIndex()
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

  const { data, isLoading } = trpc.exercise.get.useQuery(
    {
      id: exerciseIndex,
      isNewCard: true,
    },
    {
      refetchOnMount: false,
    }
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data?.orderIndex === 2) {
      setExerciseIndex(2)
    }
  }, [data?.orderIndex])

  return (
    <>
      <Header exerciseIndex={progressIndex} />
      <ChatScrollView chat={chat} exercise={data} isLoading={isLoading} />
      <ChatInput chat={chat} />
      <SourceButtomSheet exercise={data} />
    </>
  )
}
