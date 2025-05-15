import { supabase } from "@/lib/supabase";

export const selectAppId = async (id: string) => {
  const { data, error }: any = await supabase
    .from('user_app')
    .select('*')
    .eq('app_id', id)
    .single()

    if(error) {
      throw new Error(error.message);
    }
  return data;
}

export const insertAppId = async (id: string) => {
  const { data, error }: any = await supabase
    .from('user_app')
    .insert({app_id: id})
    .single()

    if(error) {
      throw new Error(error.message);
    }
  return data;
}