import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import "../../global.css";
import SessionProvider from '@/providers/SessionProvider';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SessionProvider>
      <Stack initialRouteName='index'>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="receiver/generate-qrcode" options={{ headerShown: true, headerTransparent: true, title: 'QR code', headerTintColor: '#FF4416', headerTitleStyle: { color: '#FF4416' } }} />
        <Stack.Screen name="sender/scan-qrcode" options={{ headerShown: true, headerTransparent: true, title: 'Scan QR code', headerTintColor: '#FF4416', headerTitleStyle: { color: '#FF4416' } }} />
        <Stack.Screen name="sender/camera" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </SessionProvider>
  );
}
