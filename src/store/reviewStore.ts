import { create } from 'zustand';

interface ReviewStore {
  isOpen: boolean;
  rating: number | null;
  sweetness: number | null;
  acidic: number | null;
  tannic: number | null;
  body: number | null;
  onlyReview: boolean;
  content: string;
  tag: string[];
  pairing: Record<string, string>[];
  openModal: () => void;
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
}

export const useReviewStore = create<ReviewStore>((set, _get) => ({
  isOpen: false,
  rating: null,
  sweetness: null,
  acidic: null,
  tannic: null,
  body: null,
  onlyReview: false,
  content: '',
  tag: [],
  pairing: [],
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  setRating: (value: number) => set({ rating: value }),
  setSweetnessTaste: (value: number) => set({ sweetness: value }),
  setAcidicTaste: (value: number) => set({ acidic: value }),
  setTannicTaste: (value: number) => set({ tannic: value }),
  setBodyTaste: (value: number) => set({ body: value }),
  toggleOnlyReview: () => set((state) => ({ onlyReview: !state.onlyReview })),
  addTag: (tag) => set((state) => ({ tag: [...state.tag, tag] })),
  deleteTag: (tag) => set((state) => ({ tag: state.tag.filter((t) => t !== tag) })),
  addPairing: (pairing) => set((state) => ({ pairing: [...state.pairing, pairing] })),
  deletePairing: (pairing) =>
    set((state) => ({ pairing: state.pairing.filter((p) => p !== pairing) })),
  setContent: (content) => set({ content }),
}));
