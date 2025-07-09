import { supabase } from "@/lib/supabase";

export const insertAppId = async (id: string) => {
  const { data, error }: any = await supabase
    .from('user_app')
    .insert({appId: id})
    .select()

    if(error) {
      throw new Error(error.message);
    }      
  return data;
}

export const selectAppId = async (id: string) => {
  const { data, error }: any = await supabase
    .from('user_app')
    .select('id')
    .eq('appId', id)

    if(error) {
      throw new Error(error.message);
    }
  return data;
}