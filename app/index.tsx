import useStore from '@/store/User';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
    const isConnected = useStore((s) => s.isConnected);

    if (isConnected) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/(auth)/login" />;
}

