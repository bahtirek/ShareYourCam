import * as Crypto from 'expo-crypto';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionType } from '@/types';

type SessionProviderType = {
  session: SessionType;
  startSession: (role: string, sessionId?: string) => void;
}

export const SessionContext = createContext<SessionProviderType>({
  session: {},
  startSession: () => {},
});

const SessionProvider = ({children}: PropsWithChildren) => {
  const [session, setSession] = useState<SessionType>({});
  let appId: string; 

  useEffect(() => {
    verifyAppId()
  }, [])

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

  const getSessionTokensFromLocalStorage = async() => {
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

  const startSession = async(role: string, sessionId?: string) => {
    const session: SessionType = {appId: appId, role: role}
    if(role == 'receiver') {
      const sessionToken = await generateToken();
      const sessionTokens = await getSessionTokensFromLocalStorage();
      session.sessionTokens = sessionTokens ? [...sessionTokens, sessionToken] : [sessionToken]
      session.sessionId = Crypto.randomUUID();
      saveSessionToStorage(session);
    } else {
      session.sessionId = sessionId;
    }
    setSession(session);
  }

  return(
    <SessionContext.Provider value={{session, startSession}}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider;

export const useSession = () => useContext(SessionContext)