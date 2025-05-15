import * as Crypto from 'expo-crypto';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionType } from '@/types';
import { supabase } from "@/lib/supabase";

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
        const UUID = Crypto.randomUUID();
        const id = await selectAppId(UUID);
        
        if (id && id.length == 0) {
          await insertAppId(UUID);
          await saveAppIdToStorage(UUID);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  const insertAppId = async (id: string) => {
    const { data, error }: any = await supabase
      .from('user_app')
      .insert({appId: id})
      .single()
  
      if(error) {
        throw new Error(error.message);
      }      
    return data;
  }

  const selectAppId = async (id: string) => {
    const { data, error }: any = await supabase
      .from('user_app')
      .select('*')
      .eq('appId', id)
  
      if(error) {
        throw new Error(error.message);
      }
    return data;
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

  const saveAppIdToStorage = async (UUID: string) => {
    try {
      await AsyncStorage.setItem('appId', UUID);
      setSession({appId: UUID})
    } catch (e) {
      console.log(e);
    }
  }

  const deleteAppIdInStorage = async () => {
    try {
      await AsyncStorage.removeItem('appId');
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