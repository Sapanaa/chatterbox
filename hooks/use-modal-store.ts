import {create } from 'zustand'
import { Server, ChannelType, Channel } from '@/app/generated/prisma'

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" |"editChannel"

interface ModalData {
    server?: Server
    channel?: Channel
    channelType?: ChannelType
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
