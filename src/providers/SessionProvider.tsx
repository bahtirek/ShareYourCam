import * as Crypto from 'expo-crypto';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { SessionType } from '@/types';
import { selectAppId, insertAppId } from '@/api/app-id';
import { saveSessionToStorage, deleteAppIdInStorage, saveAppIdToStorage, getSessionTokensFromLocalStorage, getAppIdFromStorage } from "@/api/storage";

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
      const appIdFromStorage = await getAppIdFromStorage()
      
      if(appIdFromStorage != null) {
        appId = appIdFromStorage
      } else {
        const UUID = await generateAppId();
        await insertAppId(UUID);
        await saveAppIdToStorage(UUID);
        setSession({appId: UUID})
      }
    } catch (e) {
      console.log(e);
    }
  }

  const generateAppId = async () => {
    let UUID, id;
    do {
      UUID = Crypto.randomUUID();
      id = await selectAppId(UUID);
    } while (id == -1);
    return UUID;
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