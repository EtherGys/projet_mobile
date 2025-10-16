import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useStore from '@/store/User';
import type { User } from '@/types/User';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const register = useStore((s) => s.register);
    const isConnected = useStore((s) => s.isConnected);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    
    const onRegister = async () => {
        if (!email || !password || !confirm) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        try {
            const user: User = {
                id: Math.random().toString(36).slice(2),
                email,
                password
            };
            const success = register(user);
            if (!success) {
                alert("L'utilisateur existe déjà");
            } else {
                router.replace('/(tabs)/calendar');
            }
        } catch (e) {
            Alert.alert('Erreur', 'Inscription impossible.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (isConnected) {
            router.replace('/(tabs)/calendar');
        }
    }, [isConnected]);
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.container}>
        <ThemedText type="title">Inscription</ThemedText>
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
        <TextInput
        placeholder="Confirmer le mot de passe"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
        />
        <Pressable onPress={onRegister} style={styles.button} disabled={loading}>
        <ThemedText style={styles.buttonText}>{loading ? '...' : "S'inscrire"}</ThemedText>
        </Pressable>
        </View>
        <Link href="/(auth)/login">
        <Link.Trigger>
        <ThemedText type="link">Déjà un compte ? Se connecter</ThemedText>
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


