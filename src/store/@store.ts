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
  message:string
}

type ToastAction = {
  success: (s: string) => void
  error:(s:string) => void
}

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

