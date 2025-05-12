import * as Crypto from 'expo-crypto';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionType } from '@/types';

type SessionProviderType = {
  session: SessionType;
  startSession: () => void;
  //startSession: () => SessionType;
}

export const SessionContext = createContext<SessionProviderType>({
  session: {},
  startSession: () => {},
  //startSession: () => ({}),
});

const SessionProvider = ({children}: PropsWithChildren) => {
  const [session, setSession] = useState<SessionType>({});
  let appId: string; 

  useEffect(() => {
    verifyAppId()
  }, [])

/*   useEffect(() => {
    saveSessionToStorage()
  }, [session]) */

  const generateToken = async(length = 32) => {
    const byteArray = new Uint8Array(length);
    await Crypto.getRandomValues(byteArray);
    const token = Array.from(byteArray, (byte) => {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
    return token;
  }

  const verifyAppId = async() => {
    try {
      const appIdFromStorage = await AsyncStorage.getItem('appId');
      if(appIdFromStorage != null) {
        appId = appIdFromStorage
      } else {
        await saveAppIdToStorage();
      }
    } catch (e) {
      console.log(e);
    }
  }

  const saveAppIdToStorage = async () => {
    const UUID = Crypto.randomUUID();
    try {
      await AsyncStorage.setItem('appId', UUID);
      setSession({appId: UUID})
    } catch (e) {
      console.log(e);
    }
  }
  
  const saveSessionToStorage = async (session: SessionType) => {
    try {
      const jsonValue = JSON.stringify(session);
      await AsyncStorage.setItem('session', jsonValue);
    } catch (e) {
      console.log(e);
    }
  }

  const startSession = async() => {
    const sessionToken = await generateToken();
    const sessionId = Crypto.randomUUID();
    const session = {appId: appId, sessionId, sessionToken}
    setSession(session);
    saveSessionToStorage(session);
  }

  return(
    <SessionContext.Provider value={{session, startSession}}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider;

export const useSession = () => useContext(SessionContext)