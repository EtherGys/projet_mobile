import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useEventsStore from '@/store/Events';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

export default function CalendarScreen() {
    const events = useEventsStore((s) => s.events);

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        for (const e of events) {
            marks[e.date] = {
                marked: true,
                dotColor: e.participated ? '#22c55e' : '#3b82f6',
            };
        }
        return marks;
    }, [events]);

    const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

    const filtered = useMemo(() => {
        if (!selectedDate) return events;
        return events.filter((e) => e.date === selectedDate);
    }, [events, selectedDate]);

    const onDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
    };

    return (
        <ThemedView style={styles.container}>
            <Calendar
                markedDates={{
                    ...markedDates,
                    ...(selectedDate ? { [selectedDate]: { selected: true } } : {}),
                }}
                onDayPress={onDayPress}
            />
            <View style={styles.listHeader}>
                <ThemedText type="subtitle">Événements {selectedDate ? `du ${selectedDate}` : ''}</ThemedText>
                <Pressable style={styles.addButton} onPress={() => router.push('/create-event')}>
                    <ThemedText style={{ color: 'white' }}>Créer</ThemedText>
                </Pressable>
            </View>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                        <ThemedText>{item.description}</ThemedText>
                        <ThemedText style={{ opacity: 0.7 }}>{item.date}</ThemedText>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <ThemedText style={{ textAlign: 'center', marginTop: 16 }}>
                        Aucun événement
                    </ThemedText>
                )}
                contentContainerStyle={{ paddingVertical: 12 }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, gap: 12 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    addButton: { backgroundColor: '#1e90ff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    card: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
});


