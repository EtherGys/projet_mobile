import type { EventItem } from '@/types/Event';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type EventsState = {
	events: EventItem[];
};

type EventsActions = {
	addEvent: (event: Omit<EventItem, 'id'>) => void;
	updateEvent: (id: string, partial: Partial<EventItem>) => void;
	removeEvent: (id: string) => void;
	setParticipated: (id: string, participated: boolean) => void;
};

const useEventsStore = create<EventsState & EventsActions>()(
	persist(
		(set) => ({
			events: [],
			addEvent: (event) =>
				set((state) => ({
					events: [
						...state.events,
						{ ...event, id: Math.random().toString(36).slice(2) },
					],
				})),
			updateEvent: (id, partial) =>
				set((state) => ({
					events: state.events.map((e) => (e.id === id ? { ...e, ...partial } : e)),
				})),
			removeEvent: (id) =>
				set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
			setParticipated: (id, participated) =>
				set((state) => ({
					events: state.events.map((e) => (e.id === id ? { ...e, participated } : e)),
				})),
		}),
		{
			name: 'events-store',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);

export default useEventsStore;


