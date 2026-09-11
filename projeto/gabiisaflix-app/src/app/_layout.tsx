import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (carregando) return;
    SplashScreen.hideAsync();

    const inAuth = segments[0] === '(auth)';

    if (!usuario && !inAuth) {
      router.replace('/(auth)/login');
    } else if (usuario && inAuth) {
      router.replace('/(tabs)');
    }
  }, [usuario, carregando, segments]);

  return (
    <>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
