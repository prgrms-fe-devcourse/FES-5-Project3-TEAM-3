import {
  initialState,
  reviewReducer,
  type ReviewAction,
  type ReviewState,
} from '@/hook/useReviewModal';
import { create } from 'zustand';

interface ReviewStore {
  isOpen: boolean;
  state: ReviewState;
  openModal: () => void;
  closeModal: () => void;
  dispatch: (action: ReviewAction) => void;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  isOpen: false,
  state: initialState,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  dispatch: (action: ReviewAction) => {
    const newState = reviewReducer(get().state, action);
    set({ state: newState });
  },
}));
