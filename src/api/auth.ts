import { supabase } from "@/lib/supabase";

export const signInAnonymously = async () => {
  const { data, error } = await supabase.auth.signInAnonymously()
    
  return data;
}