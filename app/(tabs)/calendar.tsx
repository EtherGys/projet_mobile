import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useEventsStore from '@/store/Events';
import useUserStore from '@/store/User';
import { formatDateDDMMYYYY } from '@/utils/date';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CalendarScreen() {
    const events = useEventsStore((s) => s.events);
    const toggleParticipation = useEventsStore((s) => s.toggleParticipation);
    const currentUser = useUserStore((s) => s.user);

    const today = React.useMemo(() => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }, []);

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        for (const e of events) {
            const count = e.participantIds?.length ?? 0;
            marks[e.date] = {
                marked: true,
                dotColor: count > 0 ? '#22c55e' : '#3b82f6',
            };
        }
        return marks;
    }, [events]);

    const [selectedDate, setSelectedDate] = React.useState<string | null>(today);

    const filtered = useMemo(() => {
        if (!selectedDate) return events;
        return events.filter((e) => e.date === selectedDate);
    }, [events, selectedDate]);

    const onDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
            <Calendar
                markedDates={{
                    ...markedDates,
                    ...(selectedDate ? { [selectedDate]: { selected: true } } : {}),
                }}
                current={selectedDate ?? undefined}
                onDayPress={onDayPress}
            />
            <View style={styles.listHeader}>
                <ThemedText type="subtitle">Événements {selectedDate ? `du ${formatDateDDMMYYYY(selectedDate)}` : ''}</ThemedText>
                <Pressable style={styles.addButton} onPress={() => router.push('/create-event')}>
                    <ThemedText style={{ color: 'white' }}>Créer</ThemedText>
                </Pressable>
            </View>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
               renderItem={({ item }) => {
    const count = item.participantIds?.length ?? 0;
    const hasJoined = currentUser ? (item.participantIds ?? []).includes(currentUser.id) : false;
    return (
                        <Pressable style={styles.card} onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText>{item.description}</ThemedText>
                            <ThemedText style={{ opacity: 0.7 }}>{formatDateDDMMYYYY(item.date)}</ThemedText>
            <View style={styles.cardFooter}>
                                <ThemedText>{count} participant{count > 1 ? 's' : ''}</ThemedText>
                <Pressable
                                    style={[styles.participateBtn, hasJoined ? styles.btnJoined : styles.btnJoin]}
                    onPress={() => currentUser && toggleParticipation(item.id, currentUser.id)}
                    disabled={!currentUser}
                >
                                    <ThemedText style={{ color: 'white' }}>{hasJoined ? 'Participé' : 'Participer'}</ThemedText>
                </Pressable>
            </View>
                        </Pressable>
    );
}}
                ListEmptyComponent={() => (
                    <ThemedText style={{ textAlign: 'center', marginTop: 16 }}>
                        Aucun événement
                    </ThemedText>
                )}
                contentContainerStyle={{ paddingVertical: 12 }}
            />
        </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, gap: 12 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    addButton: { backgroundColor: '#1e90ff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    card: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', gap: 6 },
    cardFooter: { marginTop: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    participateBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    btnJoin: { backgroundColor: '#2563eb' },
    btnJoined: { backgroundColor: '#16a34a' },
});


