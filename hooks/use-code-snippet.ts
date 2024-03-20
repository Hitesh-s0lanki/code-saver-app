import { create } from "zustand";

interface ModalStore {
    id: string | null;
    isOpen: boolean;
    onOpen: (id: string) => void
    onClose: () => void;
}

export const useCodeSnippetSheet = create<ModalStore>((set) => ({
    id: null,
    isOpen: false,
    onOpen: (id) => set({ id, isOpen: true }),
    onClose: () => set({ id: null, isOpen: false })
}))