import {create } from 'zustand'
import { Server } from '@/app/generated/prisma'

export type ModalType = "createServer" | "invite" | "editServer" | "members"

interface ModalData {
    server?: Server
}
interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData; // ✅ add this line
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {}, // ✅ initialize data
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }), // ✅ set data
  onClose: () => set({ isOpen: false, type: null, data: {} }), // ✅ reset data
}));
