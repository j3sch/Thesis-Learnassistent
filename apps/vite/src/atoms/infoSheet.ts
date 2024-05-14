import { atom, useAtom } from 'jotai'

const isInfoSheetOpen = atom<boolean>(false)

export function UseIsInfoSheetOpen() {
    return [...useAtom(isInfoSheetOpen)] as const
}
