// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { User } from "@prisma/client";
import { create } from "zustand";

export type ModalType = 
  | 'createNewChat'
  | 'editProfile'
  | 'userCard' // Add this line

interface ModalData {
  isGroup?: boolean;
  users?: User[];
  user?: User | { 
    id?: string;
    image?: string | null;
    name?: string;
    email?: string;
    createdAt?: string;
  }; // For editProfile modal - all optional for partial updates
  currentUser?: User | { 
    id?: string;
    image?: string | null;
    name?: string;
    email?: string;
    createdAt?: string;
  }; 
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData | null;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}))