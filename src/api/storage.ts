import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionType } from '@/types';

export const getSessionTokensFromLocalStorage = async() => {
  try {
    const jsonValue = await AsyncStorage.getItem('session');
    if(jsonValue != null) {
      const session: SessionType = JSON.parse(jsonValue);
      return session.sessionTokens
    }
  } catch (e) {
    console.log(e);
  }
}

export const saveAppIdToStorage = async (UUID: string) => {
  try {
    await AsyncStorage.setItem('appId', UUID);
  } catch (e) {
    console.log(e);
  }
}

export const deleteAppIdInStorage = async () => {
  try {
    await AsyncStorage.removeItem('appId');
  } catch (e) {
    console.log(e);
  }
}

export const saveSessionToStorage = async (session: SessionType) => {
  try {
    const jsonValue = JSON.stringify(session);
    await AsyncStorage.setItem('session', jsonValue);
  } catch (e) {
    console.log(e);
  }
}

export const getAppIdFromStorage = async () => {
  try {
    const appIdFromStorage = await AsyncStorage.getItem('appId');   
    return appIdFromStorage;
  } catch (e) {
    console.log(e);
  }
}