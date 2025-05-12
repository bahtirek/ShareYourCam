import * as Crypto from 'expo-crypto';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type SessionType = {
  appId?: string,
  sessionId?: string,
  sessionToken?: string,
}

type SessionProviderType = {
  session: SessionType;
  startSession: () => void;
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

/*   const sessionAccountToStorage = async (account: SessionType) => {
 const UUID = Crypto.randomUUID();
    try {
      const jsonValue = JSON.stringify(account);
      await AsyncStorage.setItem('account', jsonValue);
      setAccount(account);
    } catch (e) {
      console.log(e);
    }
  }

  const getAccountFromStorage = async() => {
    try {
      const jsonValue = await AsyncStorage.getItem('account');
      if(jsonValue != null) {
        setAccount(JSON.parse(jsonValue)) 
      }
    } catch (e) {
      console.log(e);
    }
  } */


  return(
    <SessionContext.Provider value={{session, startSession}}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider;

export const useAccount = () => useContext(SessionContext)