import type { User } from '@/types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthState = {
	isConnected: boolean;
	user: User | null;
	isHydrated: boolean;
};

type AuthActions = {
	login: (user: User) => void;
	logout: () => void;
	setHydrated: (value: boolean) => void;
};

const useStore = create<AuthState & AuthActions>()(
	persist(
		(set) => ({
			isConnected: false,
			user: null,
			isHydrated: false,
			login: (user: User) => set({ user, isConnected: true }),
			logout: () => set({ user: null, isConnected: false }),
			setHydrated: (value: boolean) => set({ isHydrated: value }),
		}),
		{
			name: 'auth-store',
			storage: createJSONStorage(() => AsyncStorage),
			onRehydrateStorage: () => (state) => {
				// Mark store as hydrated after rehydration completes
				state?.setHydrated(true);
			},
		}
	)
);

export default useStore;