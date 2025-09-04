import type { Tables } from '@/supabase/database.types';
import { create } from 'zustand';

interface ReviewStore {
  isOpen: boolean;
  isEditMode: boolean;
  rating: number | null;
  sweetness: number | null;
  acidic: number | null;
  tannic: number | null;
  body: number | null;
  onlyReview: boolean;
  content: string;
  tag: string[];
  pairing: Record<string, string>[];
  openModal: (value?: {
    review: Tables<'reviews'>;
    tags: string[];
    pairings: Record<string, string>[];
  }) => void;
  closeModal: () => void;
  setRating: (value: number) => void;
  setSweetnessTaste: (value: number) => void;
  setAcidicTaste: (value: number) => void;
  setTannicTaste: (value: number) => void;
  setBodyTaste: (value: number) => void;
  toggleOnlyReview: () => void;
  addTag: (value: string) => void;
  deleteTag: (value: string) => void;
  addPairing: (value: Record<string, string>) => void;
  deletePairing: (value: Record<string, string>) => void;
  setContent: (value: string) => void;
  reset: () => void;
  log: () => void;
}

const initialState = {
  isOpen: false,
  isEditMode: false,
  rating: null,
  sweetness: null,
  acidic: null,
  tannic: null,
  body: null,
  onlyReview: false,
  content: '',
  tag: [] as string[],
  pairing: [] as Record<string, string>[],
};

export const useReviewStore = create<ReviewStore>((set, get) => ({
  isOpen: false,
  isEditMode: false,
  rating: null,
  sweetness: null,
  acidic: null,
  tannic: null,
  body: null,
  onlyReview: false,
  content: '',
  tag: [],
  pairing: [],
  openModal: (value) => {
    if (value) {
      // 수정 모드
      set({
        isOpen: true,
        rating: value.review.rating,
        sweetness: value.review.sweetness_score,
        acidic: value.review.acidity_score,
        tannic: value.review.tannin_score,
        body: value.review.body_score,
        content: value.review.content,
        pairing: value.pairings,
        tag: value.tags,
        isEditMode: true,
        onlyReview: true,
      });
    } else {
      // 새 리뷰 작성 모드 (기본값만 유지)
      set({
        isOpen: true,
        rating: null,
        sweetness: null,
        acidic: null,
        tannic: null,
        body: null,
        content: '',
        tag: [],
        pairing: [],
      });
    }
  },

  closeModal: () => set({ isOpen: false }),
  setRating: (value: number) => set({ rating: value }),
  setSweetnessTaste: (value: number) => set({ sweetness: value }),
  setAcidicTaste: (value: number) => set({ acidic: value }),
  setTannicTaste: (value: number) => set({ tannic: value }),
  setBodyTaste: (value: number) => set({ body: value }),
  toggleOnlyReview: () =>
    set((state) => ({
      onlyReview: !state.onlyReview,
    })),
  addTag: (tag) => set((state) => ({ tag: [...state.tag, tag] })),
  deleteTag: (tag) => set((state) => ({ tag: state.tag.filter((t) => t !== tag) })),
  addPairing: (pairing) => set((state) => ({ pairing: [...state.pairing, pairing] })),
  deletePairing: (pairing) =>
    set((state) => ({
      pairing: state.pairing.filter((p) => {
        const [key, value] = Object.entries(p)[0];
        const [targetKey, targetValue] = Object.entries(pairing)[0];
        return !(key === targetKey && value === targetValue);
      }),
    })),
  setContent: (content) => set({ content }),
  reset: () => set(initialState),
  log: () => get(),
}));
