import * as Crypto from 'expo-crypto';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { SessionType } from '@/types';
import { selectAppId, insertAppId } from '@/api/app-id';
import { signInAnonymously, getAuthSession } from '@/api/auth';
import { insertSession } from '@/api/sessions';
import { saveAppIdToStorage, getAppIdFromStorage } from "@/api/storage";


type SessionProviderType = {
  session: SessionType;
  startSession: () => Promise<SessionType | undefined>;
  setReceiverSessionId: (receiverSessionId: string) => void;
  isInitialized: boolean;
}

export const SessionContext = createContext<SessionProviderType>({
  session: {sessionId: 'test'},
  startSession: (async () => ({})),
  setReceiverSessionId: () => ({}),
  isInitialized: false
});

const SessionProvider = ({children}: PropsWithChildren) => {
  const [session, setSession] = useState<SessionType>({});
  const [isInitialized, setIsInitialized] = useState(false);
  let appId: string; 

  useEffect(() => {
    verifyAppId()
  }, [])

  const verifyAppId = async() => {   
    try {
      const appIdFromStorage = await getAppIdFromStorage();   
      
      if(appIdFromStorage != null) {
        appId = appIdFromStorage
        setSession((prevSession) => ({ ...prevSession, appId: appId }))
      } else {
        const UUID = await generateAppId();
        await insertAppId(UUID);
        await saveAppIdToStorage(UUID);
        setSession((prevSession) => ({ ...prevSession, appId: UUID }))
      }
    } catch (e) {
      console.log(e);
    }
    setIsInitialized(true);
  }

  const generateAppId = async () => {
    let UUID, id;
    do {
      UUID = Crypto.randomUUID();
      id = await selectAppId(UUID);
    } while (id == -1);
    return UUID;
  }

  const generateSessionId = async () => {
    let UUID, result;
    if(!session.appId) await verifyAppId;
    do {
      UUID = Crypto.randomUUID();
      result = await insertSession(UUID, session.appId!);

      if(result.success) return {sessionId: UUID, sessionDBId: result.session_id}
    } while (!result.success);
  }

  const startSession = async() => {
    const { sessionData, sessionError } = await getAuthSession();
    
    if(!sessionData.session) await signInAnonymously();

    if(!session.sessionId) {
      const sessionData = await generateSessionId();
      setSession({...session, sessionId: sessionData?.sessionId, sessionDBId: sessionData?.sessionDBId})

      return sessionData
    } else {
      return session
    }
  }

  const setReceiverSessionId = (receiverSessionId: string) => {
    setSession({...session, receiverSessionId})
  }

  return(
    <SessionContext.Provider value={{session, startSession, isInitialized, setReceiverSessionId}}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider;

export const useSession = () => useContext(SessionContext)