import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useEventsStore from '@/store/Events';
import useUserStore from '@/store/User';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const events = useEventsStore((s) => s.events);
    const updateEvent = useEventsStore((s) => s.updateEvent);
    const removeEvent = useEventsStore((s) => s.removeEvent);
    const currentUser = useUserStore((s) => s.user);

    const event = useMemo(() => events.find((e) => e.id === id), [events, id]);

    const [title, setTitle] = useState(event?.title ?? '');
    const [description, setDescription] = useState(event?.description ?? '');
    const [date, setDate] = useState(event?.date ?? '');
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    if (!event) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <ThemedText>Événement introuvable.</ThemedText>
            </ThemedView>
            </SafeAreaView>
        );
    }

    const onSave = async () => {
        if (!title || !description || !date) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            Alert.alert('Format date', 'Utilisez le format yyyy-MM-dd');
            return;
        }
        setLoading(true);
        try {
            updateEvent(event.id, { title, description, date });
            router.back();
        } catch (e) {
            Alert.alert('Erreur', "Impossible de modifier l'événement");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = () => {
        if (Platform.OS === 'web') {
            // eslint-disable-next-line no-restricted-globals
            const ok = confirm('Voulez-vous supprimer cet événement ?');
            if (ok) {
                removeEvent(event.id);
                router.back();
            }
            return;
        }
        Alert.alert('Supprimer', 'Voulez-vous supprimer cet événement ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer', style: 'destructive', onPress: () => {
                    removeEvent(event.id);
                    router.back();
                }
            }
        ]);
    };

    return (
        <>
           <Stack.Screen
                options={{
                    title: `Événement`, 
                }}
            />
        <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
            <ThemedText type="title">Modifier l'événement</ThemedText>
            <View style={styles.form}>
                <TextInput placeholder="Titre" value={title} onChangeText={setTitle} style={styles.input} />
                <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
                {Platform.OS === 'web' ? (
                    <View style={styles.input}>
                        {React.createElement('input', {
                            type: 'date',
                            value: date,
                            onChange: (e: any) => setDate(e.target.value),
                            style: { width: '100%', border: 'none', outline: 'none', background: 'transparent' },
                        })}
                    </View>
                ) : (
                    <>
                        <Pressable onPress={() => setShowPicker(true)} style={[styles.input, { justifyContent: 'center' }]}> 
                            <ThemedText>{date ? `${date.split('-')[2]}/${date.split('-')[1]}/${date.split('-')[0]}` : 'Choisir une date'}</ThemedText>
                        </Pressable>
                        {showPicker && (
                            <DateTimePicker
                                value={date ? new Date(date) : new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowPicker(Platform.OS === 'ios');
                                    if (selectedDate) {
                                        const y = selectedDate.getFullYear();
                                        const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                        const d = String(selectedDate.getDate()).padStart(2, '0');
                                        setDate(`${y}-${m}-${d}`);
                                    }
                                }}
                            />
                        )}
                    </>
                )}
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Pressable onPress={onSave} style={[styles.button, { backgroundColor: '#1e90ff' }]} disabled={loading}>
                        <ThemedText style={styles.buttonText}>{loading ? '...' : 'Enregistrer'}</ThemedText>
                    </Pressable>
                        <Pressable onPress={onDelete} style={[styles.button, { backgroundColor: '#ef4444' }]}>
                            <ThemedText style={styles.buttonText}>Supprimer</ThemedText>
                        </Pressable>
                </View>
            </View>
        </ThemedView>
        </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 16 },
    form: { gap: 12 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
    button: { padding: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
    buttonText: { color: 'white', textAlign: 'center' },
});


