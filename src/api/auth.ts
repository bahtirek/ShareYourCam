import { supabase } from "@/lib/supabase";

export const signInAnonymously = async () => {
  const { data, error } = await supabase.auth.signInAnonymously()
    
  return {newSessionData: data, newSessionError: error}
}
export const getAuthSession = async () => {
  const { data, error } = await supabase.auth.getSession()

  return {sessionData: data, sessionError: error}
}