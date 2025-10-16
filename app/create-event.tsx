import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useEventsStore from '@/store/Events';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function CreateEventScreen() {
    const addEvent = useEventsStore((s) => s.addEvent);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(''); // yyyy-MM-dd
    const [loading, setLoading] = useState(false);

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
            addEvent({ title, description, date });
            router.back();
        } catch (e) {
            Alert.alert('Erreur', "Impossible d'enregistrer l'événement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Créer un événement</ThemedText>
            <View style={styles.form}>
                <TextInput placeholder="Titre" value={title} onChangeText={setTitle} style={styles.input} />
                <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
                <TextInput placeholder="Date (yyyy-MM-dd)" value={date} onChangeText={setDate} style={styles.input} />
                <Pressable onPress={onSave} style={styles.button} disabled={loading}>
                    <ThemedText style={styles.buttonText}>{loading ? '...' : 'Enregistrer'}</ThemedText>
                </Pressable>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 16 },
    form: { gap: 12 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
    button: { backgroundColor: '#16a34a', padding: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white' },
});


