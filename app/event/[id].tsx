import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useEventsStore from '@/store/Events';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const events = useEventsStore((s) => s.events);
    const updateEvent = useEventsStore((s) => s.updateEvent);
    const removeEvent = useEventsStore((s) => s.removeEvent);

    const event = useMemo(() => events.find((e) => e.id === id), [events, id]);

    const [title, setTitle] = useState(event?.title ?? '');
    const [description, setDescription] = useState(event?.description ?? '');
    const [date, setDate] = useState(event?.date ?? '');
    const [loading, setLoading] = useState(false);

    if (!event) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Événement introuvable.</ThemedText>
            </ThemedView>
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
        <ThemedView style={styles.container}>
            <ThemedText type="title">Modifier l'événement</ThemedText>
            <View style={styles.form}>
                <TextInput placeholder="Titre" value={title} onChangeText={setTitle} style={styles.input} />
                <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
                <TextInput placeholder="Date (yyyy-MM-dd)" value={date} onChangeText={setDate} style={styles.input} />
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
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 16 },
    form: { gap: 12 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
    button: { padding: 12, borderRadius: 8, alignItems: 'center', flex: 1 },
    buttonText: { color: 'white', textAlign: 'center' },
});


