import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="book" options={{ headerShown: true, title: 'Select Campus' }} />
        <Stack.Screen name="select-date" options={{ headerShown: true }} />
        <Stack.Screen name="select-time" options={{ headerShown: true }} />
        <Stack.Screen name="select-elder" options={{ headerShown: true }} />
        <Stack.Screen name="confirmation" options={{ headerShown: true }} />
      </Stack>
    </ThemeProvider>
  );
}