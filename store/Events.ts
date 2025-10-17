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
	toggleParticipation: (id: string, userId: string) => void;
};

const useEventsStore = create<EventsState & EventsActions>()(
	persist(
		(set) => ({
			events: [],
			addEvent: (event) =>
				// Store the event in async storage
				set((state) => ({
					events: [...state.events, { ...event, id: Math.random().toString(36).slice(2), participantIds: [] }],
				})),
			updateEvent: (id, partial) =>
				set((state) => ({
					events: state.events.map((e) => (e.id === id ? { ...e, ...partial } : e)),
				})),
			removeEvent: (id) =>
				set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
			toggleParticipation: (id, userId) =>
				set((state) => ({
					events: state.events.map((e) => {
						if (e.id !== id) return e;
						const setIds = new Set(e.participantIds ?? []);
						if (setIds.has(userId)) {
							setIds.delete(userId);
						} else {
							setIds.add(userId);
						}
						return { ...e, participantIds: Array.from(setIds) };
					}),
				})),
		}),
		{
			name: 'events-store',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);

export default useEventsStore;


