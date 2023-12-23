import { create } from 'zustand'

interface MutateState {
  isMutate: boolean
  setIsMutate: (isMutate: boolean) => void
}

export const useMutationSuccess = create<MutateState>()((set) => ({
  isMutate: false,
  setIsMutate: (isMutate: boolean) => set(() => ({ isMutate }))
}))