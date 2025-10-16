import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useStore from '@/store/User';
import type { User } from '@/types/User';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const login = useStore((s) => s.login);
    const isConnected = useStore((s) => s.isConnected);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }
        setLoading(true);
        try {
            const user: User = {
                id: Math.random().toString(36).slice(2),
                email,
            };
            login(user);
            router.replace('/(tabs)');
        } catch (e) {
            Alert.alert('Erreur', 'Impossible de se connecter.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isConnected) {
            router.replace('/(tabs)');
        }
    }, [isConnected]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
            <ThemedText type="title">Connexion</ThemedText>
            <View style={styles.form}>
                <TextInput
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />
                <Pressable onPress={onLogin} style={styles.button} disabled={loading}>
                    <ThemedText style={styles.buttonText}>{loading ? '...' : 'Se connecter'}</ThemedText>
                </Pressable>
            </View>
            <Link href="/(auth)/register">
                <Link.Trigger>
                    <ThemedText type="link">Créer un compte</ThemedText>
                </Link.Trigger>
            </Link>
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


