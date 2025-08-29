import type { ConfirmOptions } from '@/@types/global';
import supabase from '@/supabase/supabase';
import { create } from 'zustand';

type AuthState = {
  userId: string | null;
  userEmail: string | null;
  isLoading: boolean;
};

type AuthAction = {
  fetch: () => Promise<void>;
  subscribe: () => void;
  signOut: () => Promise<void>;
};

type ToastState = {
  message: string;
};

type ToastAction = {
  success: (s: string) => void;
  error: (s: string) => void;
};

type ConfirmState = {
  isOpen: boolean;
  options: ConfirmOptions;
  resolver: ((v: boolean) => void) | null;
  open: (opts: ConfirmOptions) => Promise<boolean>;
  close: (v: boolean) => void;
  setBusy: (busy: boolean) => void;
  afterExit: () => void;
};

export const useAuth = create<AuthState & AuthAction>((set) => ({
  userId: null,
  userEmail: null,
  isLoading: true,

  fetch: async () => {
    set({ isLoading: true });
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    set({
      userId: session?.user.id,
      userEmail: session?.user?.email ?? null,
      isLoading: false,
    });
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    set({ userId: null, userEmail: null });
  },

  subscribe: () => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        userId: session?.user.id,
        userEmail: session?.user.email,
        isLoading: false,
      });
    });

    return () => listener.subscription.unsubscribe();
  },
}));

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  options: {},
  resolver: null,

  open: (opts) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        options: {
          allowOutsideClose: true,
          allowEscapeClose: true,
          tone: 'default',
          confirmText: '확인',
          cancelText: '취소',
          ...opts,
        },
        resolver: resolve,
      });
    });
  },
  close: (v) => {
    const { resolver, options } = get();
    if (options.busy) return;
    set({ isOpen: false });
    resolver?.(v);
    set({ resolver: null });
  },
  setBusy: (busy) => set((s) => ({ options: { ...s.options, busy } })),
  afterExit: () => set({ options: {} }),
}));
