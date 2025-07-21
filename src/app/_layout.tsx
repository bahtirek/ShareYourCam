import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import "../../global.css";
import SessionProvider from '@/providers/SessionProvider';
import ImageProvider from '@/providers/ImagesProvider';
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
      <ImageProvider>
        <Stack initialRouteName='index'>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="receiver/generate-qrcode" options={{ headerShown: true, headerTransparent: true, title: 'QR code', headerTintColor: '#1e90ff', headerTitleStyle: { color: '#1e90ff' } }} />
          <Stack.Screen name="receiver/images" options={{ headerShown: true, headerTransparent: true, title: 'Images', headerTintColor: '#db7093', headerTitleStyle: { color: '#db7093' } }} />
          <Stack.Screen name="sender/scan-qrcode" options={{ headerShown: true, headerTransparent: true, title: 'Scan QR code', headerTintColor: '#ffa500', headerTitleStyle: { color: '#ffa500' } }} />
          <Stack.Screen name="sender/camera" options={{ headerShown: true, headerTransparent: true, title: 'Say cheese', headerTintColor: '#ffa500', headerTitleStyle: { color: '#ffa500' } }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ImageProvider>
    </SessionProvider>
  );
}
