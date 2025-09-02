import type { ConfirmOptions } from '@/@types/global';
import useToast from '@/hook/useToast';
import supabase from '@/supabase/supabase';
import { create } from 'zustand';

type AuthState = {
  userId: string | null;
  userEmail: string | null;
  userPhone: string | null;
  isLoading: boolean;
};

type AuthAction = {
  fetch: () => Promise<void>;
  subscribe: () => void;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
  userPhone: null,
  isLoading: true,

  fetch: async () => {
    set({ isLoading: true });
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    set({
      userId: session?.user.id,
      userEmail: session?.user?.email ?? null,
      userPhone: session?.user.phone ?? null,
      isLoading: false,
    });
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) useToast('success', '로그아웃 하셨습니다');
    set({ userId: null, userEmail: null, userPhone: null });
  },

  subscribe: () => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        userId: session?.user.id,
        userEmail: session?.user.email,
        userPhone: session?.user.phone,
        isLoading: false,
      });
    });

    return () => listener.subscription.unsubscribe();
  },

  resetPassword: async (userEmail) => {
    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: `${window.location.origin}/account/resetpassword`,
    });
    if (error) {
      useToast('error', '이메일을 다시 확인해주세요');
      return;
    } else {
      useToast('success', '인증메일을 확인해주세요');
    }
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
