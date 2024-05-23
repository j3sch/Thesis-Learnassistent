import { atom, useAtom } from 'jotai'

const exerciseIndex = atom<number>(2)

export function useExerciseIndex() {
  return [...useAtom(exerciseIndex)] as const
}

const progressIndex = atom<number>(1)

export function useProgressIndex() {
  return [...useAtom(progressIndex)] as const
}
