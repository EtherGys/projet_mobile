import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useEventsStore from '@/store/Events';
import useUserStore from '@/store/User';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

export default function CreateEventScreen() {
    const addEvent = useEventsStore((s) => s.addEvent);
    const currentUser = useUserStore((s) => s.user);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(''); // yyyy-MM-dd
    const [showPicker, setShowPicker] = useState(false);
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
            addEvent({ title, description, date, createdByUserId: currentUser?.id ?? 'anonymous' });
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
                {Platform.OS === 'web' ? (
                    <TextInput placeholder="Date (yyyy-MM-dd)" value={date} onChangeText={setDate} style={styles.input} />
                ) : (
                    <>
                        <Pressable onPress={() => setShowPicker(true)} style={[styles.input, { justifyContent: 'center' }]}>
                            <ThemedText>{date || 'Choisir une date'}</ThemedText>
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


