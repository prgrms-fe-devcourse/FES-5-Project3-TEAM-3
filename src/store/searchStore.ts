// stores/useSearchStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { useAuth } from './@store';

const initialSearchState = {
  isOpen: false,
  query: '',
  recent: [] as string[],
};

type SearchStore = typeof initialSearchState & {
  isOpen: boolean;
  query: string;
  recent: string[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (q: string) => void;
  addRecent: (q: string) => void;
  clearRecent: () => void;
  reset: () => void;
};

const userScopedStorage = (): StateStorage => ({
  getItem: (name) => {
    const uid = useAuth.getState().userId ?? 'anon';
    return typeof window === 'undefined' ? null : window.localStorage.getItem(`${name}::${uid}`);
  },
  setItem: (name, value) => {
    const uid = useAuth.getState().userId ?? 'anon';
    if (typeof window !== 'undefined') window.localStorage.setItem(`${name}::${uid}`, value);
  },
  removeItem: (name) => {
    const uid = useAuth.getState().userId ?? 'anon';
    if (typeof window !== 'undefined') window.localStorage.removeItem(`${name}::${uid}`);
  },
});

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      ...initialSearchState,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setQuery: (q) => set({ query: q }),

      addRecent: (q) => {
        const s = q.trim();
        if (!s) return;
        const uniq = [s, ...get().recent.filter((v) => v !== s)].slice(0, 10);
        set({ recent: uniq });
      },

      clearRecent: () => set({ recent: [] }),

      reset: () => set(initialSearchState),
    }),
    {
      name: 'USER_SEARCH',
      storage: createJSONStorage(userScopedStorage),
      version: 1,
    }
  )
);
