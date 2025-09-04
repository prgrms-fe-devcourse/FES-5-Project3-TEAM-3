// stores/useSearchStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type SearchStore = {
  isOpen: boolean;
  query: string; 
  recent: string[]; 
  open: () => void;
  close: () => void;
  toggle:() => void
  setQuery: (q: string) => void;
  addRecent: (q: string) => void;
  clearRecent: () => void;
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      query: '',
      recent: [],

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle:() => set((state) =>({isOpen:!state.isOpen})),
      setQuery: (q) => set({ query: q }),

      addRecent: (q) => {
        const s = q.trim();
        if (!s) return;
        const uniq = [s, ...get().recent.filter((v) => v !== s)].slice(0, 10);
        set({ recent: uniq });
      },

      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: 'USER_SEARCH', 
      storage: createJSONStorage(() => localStorage),

      version: 1,
    }
  )
);
