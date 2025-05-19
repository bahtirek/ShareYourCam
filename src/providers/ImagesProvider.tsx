import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { SessionType } from '@/types';
import { selectAppId, insertAppId } from '@/api/app-id';
import { signInAnonymously } from '@/api/auth';
import { saveSessionToStorage, deleteAppIdInStorage, saveAppIdToStorage, getSessionIdsFromLocalStorage, getAppIdFromStorage } from "@/api/storage";
import { getSessionId } from '@/services/JWTServices';


type ImageProviderType = {
  session: SessionType;
  startSession: (role: string, sessionId?: string) => void;
}

export const ImageContext = createContext<ImageProviderType>({
  session: {sessionId: 'test 12'},
  startSession: () => ({})
});


export default function ImageContextProvider({children}: PropsWithChildren) {
  const [session, setSession] = useState<SessionType>({sessionId: 'tesinsession id'});
  const appId = 'appid'

  const startSession = async(role: string, receiverSessionId?: string) => {
    console.log(role);
    
    const newSession: SessionType = {appId: appId, role: role}
    const jwt = await signInAnonymously();
    const sessionId = getSessionId(jwt);
    newSession.jwt = jwt;
    newSession.sessionId = sessionId;
    console.log("startsession", receiverSessionId);
    if(role == 'receiver') {
      const sessionIds = await getSessionIdsFromLocalStorage();
      newSession.sessionIds = sessionIds ? [...sessionIds, sessionId] : [sessionId]
      await saveSessionToStorage(newSession);
    } else {
      newSession.receiverSessionId = receiverSessionId
    }
    setSession(newSession);
    
  }
  return (
    <ImageContext.Provider value={{session, startSession}}>
      {children}
    </ImageContext.Provider>

  )
}