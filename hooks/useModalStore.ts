// hooks/useModalStore.ts

import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType) => set({ type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
