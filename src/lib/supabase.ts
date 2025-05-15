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

const supabaseUrl = 'https://ldntsmcwlpywzwqmumrd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkbnRzbWN3bHB5d3p3cW11bXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDA3NjQsImV4cCI6MjA2MjY3Njc2NH0.DlxVoFRM-v5KlvtHbbk-qe-aElXwDmyY_S2015Jvue8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
