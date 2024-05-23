import { atom, useAtom } from 'jotai'

const flashcardIndex = atom<number>(1)

export function useFlashcardIndex() {
    return [...useAtom(flashcardIndex)] as const
}

const progressFlashcardIndex = atom<number>(1)

export function useProgressFlashcardIndex() {
    return [...useAtom(progressFlashcardIndex)] as const
}
