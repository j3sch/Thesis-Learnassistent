import { atom, useAtom } from 'jotai'

const flashcardIndex = atom<number>(1)

export function useFlashcardIndex() {
  return [...useAtom(flashcardIndex)] as const
}
