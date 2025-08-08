import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { authApi , User } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  register: (name : string, email : string, password : string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      
      register: async (name : string, email : string, password : string) => {
        const res =  await authApi.register({name , email, password});
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        set({ user, token });
        toast.success('Account created!');
        return user;
      },

      login: async (email : string, password : string) => {
        const res = await authApi.login(email, password);
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token });
        toast.success('Logged in!');
      },

      logout: async () => {
        await authApi.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
        toast.success('Logged out!');
      },



      isAdmin: () => {
        const user = get().user;
        return Boolean(user?.roles.includes('admin'));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
