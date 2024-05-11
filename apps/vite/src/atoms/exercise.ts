import { atom, useAtom } from 'jotai'

const exerciseIndex = atom<number>(1)

export function useExerciseIndex() {
  return [...useAtom(exerciseIndex)] as const
}
