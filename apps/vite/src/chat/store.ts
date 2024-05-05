import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Chat {
  id: number
  type: 'user' | 'assistant'
  text: string
}

type State = {
  chat: Chat[]
}

type Action = {
  actions: {
    addChat: (newChat: Chat) => void
  }
}

export const useChatStore = create<State & Action>()(
  persist(
    (set) => ({
      chat: [],
      actions: {
        addChat: (newChat: Chat) => set((state) => ({ chat: [...state.chat, newChat] })),

        updateChat(index: number | string, updatedChat: Partial<Chat>) {
          set((state) => {
            if (!state.chat.some((chatItem) => chatItem.id === index)) {
              throw new Error(`No chat item found with id: ${index}`)
            }
            return {
              chat: state.chat.map((chatItem) =>
                chatItem.id === index ? { ...chatItem, ...updatedChat } : chatItem
              ),
            }
          })
        },
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ chat: state.chat }),
    }
  )
)

export const useChatActions = () => useChatStore((state) => state.actions)
export const useChatValue = () => useChatStore((state) => state.chat)
