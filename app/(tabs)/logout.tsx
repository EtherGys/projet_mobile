import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useStore from '@/store/User';
import type { User } from '@/types/User';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LogoutScreen() {
    const logout = useStore((s) => s.logout);
    const isConnected = useStore((s) => s.isConnected);
    const [loading, setLoading] = useState(false);

    const onLogout = async () => {
        setLoading(true);
        try {
            logout();
            router.replace('/(auth)/login');
        } catch (e) {
            Alert.alert('Erreur', 'Erreur lors de la déconnexion.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
            <ThemedText type="title">Déconnexion</ThemedText>
            <View style={styles.form}>
                <Pressable onPress={onLogout} style={styles.button} disabled={loading}>
                    <ThemedText style={styles.buttonText}>{loading ? '...' : 'Se déconnecter'}</ThemedText>
                </Pressable>
            </View>
        </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 16 },
    form: { width: '100%', gap: 12 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
    button: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white' },
});


