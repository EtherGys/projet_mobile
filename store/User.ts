import type { User } from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthState = {
  isConnected: boolean;
  user: User | null;
  users: User[];
  isHydrated: boolean;
};

type AuthActions = {
  register: (user: User) => boolean; // return false if already exists
  login: (email: string, password: string) => boolean; // return true if success
  logout: () => void;
  setHydrated: (value: boolean) => void;
};

const useStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      isConnected: false,
      user: null,
      users: [],
      isHydrated: false,
      
      register: (newUser: User) => {
        const { users } = get();
        const exists = users.some((u) => u.email === newUser.email);
        if (exists) return false;
        
        set({ users: [...users, newUser] });
        return true;
      },
      
      login: (email: string, password: string) => {
        const { users } = get();
        const found = users.find(
          (u) => u.email === email && u.password === password
        );
        if (found) {
          set({ user: found, isConnected: true });
          return true;
        }
        return false;
      },
      
      logout: () => set({ user: null, isConnected: false }),
      
      setHydrated: (value: boolean) => set({ isHydrated: value }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export default useStore;
