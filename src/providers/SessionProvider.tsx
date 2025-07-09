import * as Crypto from 'expo-crypto';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { SessionType } from '@/types';
import { selectAppId, insertAppId } from '@/api/app-id';
import { signInAnonymously, getSession } from '@/api/auth';
import { insertSession } from '@/api/sessions';
import { saveSessionToStorage, deleteAppIdInStorage, saveAppIdToStorage, getSessionIdsFromLocalStorage, getAppIdFromStorage } from "@/api/storage";
import { getSessionId } from '@/services/JWTServices';

type SessionProviderType = {
  session: SessionType;
  startSession: (role: string, sessionId?: string) => Promise<boolean>;
  setReceiverSessionId: (receiverSessionId: string) => void;
  isInitialized: boolean;
}

export const SessionContext = createContext<SessionProviderType>({
  session: {sessionId: 'test'},
  startSession: (async () => (false)),
  setReceiverSessionId: () => ({}),
  isInitialized: false
});

//const jwt = {"session": {"access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6InREWExOdXRDa1VDUGVHb00iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2xkbnRzbWN3bHB5d3p3cW11bXJkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI1YzQ2OGMwNy00MjA5LTQwNjUtYTg0NC01Y2NkMzBjZmQzMjMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ3NTk3OTEyLCJpYXQiOjE3NDc1OTQzMTIsImVtYWlsIjoiIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnt9LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJhbm9ueW1vdXMiLCJ0aW1lc3RhbXAiOjE3NDc1OTQzMTJ9XSwic2Vzc2lvbl9pZCI6IjZlOGJkODY0LTc0Y2MtNDM4Ny04ZGQ0LWJjYTNlODVhNTEzYyIsImlzX2Fub255bW91cyI6dHJ1ZX0.tTCA3BDAqMjyDlScj-5IEzVn8VW1hJzIpcK5Bli97Mw", "expires_at": 1747597912, "expires_in": 3600, "refresh_token": "g35fodjzbyos", "token_type": "bearer", "user": {"app_metadata": [Object], "aud": "authenticated", "created_at": "2025-05-18T18:51:52.319674Z", "email": "", "id": "5c468c07-4209-4065-a844-5ccd30cfd323", "identities": [Array], "is_anonymous": true, "last_sign_in_at": "2025-05-18T18:51:52.321690727Z", "phone": "", "role": "authenticated", "updated_at": "2025-05-18T18:51:52.323397Z", "user_metadata": [Object]}}, "user": {"app_metadata": {}, "aud": "authenticated", "created_at": "2025-05-18T18:51:52.319674Z", "email": "", "id": "5c468c07-4209-4065-a844-5ccd30cfd323", "identities": [], "is_anonymous": true, "last_sign_in_at": "2025-05-18T18:51:52.321690727Z", "phone": "", "role": "authenticated", "updated_at": "2025-05-18T18:51:52.323397Z", "user_metadata": {}}}

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
      } else {
        const UUID = await generateAppId();
        await insertAppId(UUID);
        await saveAppIdToStorage(UUID);
        setSession({appId: UUID})
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

  const startSession = async(role: string, receiverSessionId?: string) => {
    const { sessionData, sessionError } = await getSession();
    
    if(sessionData.session) {
      await startNewSession(sessionData, role, receiverSessionId);
      return true
    }
    
    const { newSessionData, newSessionError } = await signInAnonymously();
    if (newSessionData.session) {
      const sessionId = getSessionId(newSessionData.session.access_token);
      await insertSession(sessionId, appId)
      .then(result => {
        if (result.success) {
          console.log(`Session created with ID: ${result.session_id}`)
        } else {
          console.log(`Failed: ${result.message}`)
        }
      })
      await startNewSession(newSessionData, role)
      return true
    }

    return false
  }

  const startNewSession = async(jwt: any,role: string, receiverSessionId?: string) => {    
    const newSession: SessionType = {appId: appId, role: role}
    const sessionId = getSessionId(jwt.session.access_token);
    newSession.jwt = jwt;
    newSession.sessionId = sessionId;
    
    if(role == 'receiver') {
      const sessionIds = await getSessionIdsFromLocalStorage();
      newSession.sessionIds = sessionIds ? [...sessionIds, sessionId] : [sessionId]
      await saveSessionToStorage(newSession);
    } else {
      newSession.receiverSessionId = receiverSessionId
    }
    setSession(newSession);
    
    return true
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