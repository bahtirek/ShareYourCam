import { supabase } from "@/lib/supabase";

export const insertSession = async (sessionId: string, appId: string) => {
  console.log(sessionId, appId)
  try {
    const { data, error } = await supabase
      .rpc('add_session', {
        p_session_id: sessionId,
        p_app_id: appId
      })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}
