import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === "web";

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    return isWeb ? await AsyncStorage.getItem(key) : await SecureStore.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    return isWeb
      ? await AsyncStorage.setItem(key, value)
      : await SecureStore.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (isWeb) {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};
const ExpoSecureStoreAdapter2 = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
