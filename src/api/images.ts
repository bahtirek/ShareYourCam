import { supabase } from "@/lib/supabase";

export const insertImageData = async (receiverSessionId: string, url: string) => {
  console.log('inserting image dtat', receiverSessionId, url);
  
  const { data, error }: any = await supabase
    .from('images')
    .insert({session_id: receiverSessionId, url: url})

    if(error) {
      throw new Error(error.message);
    }
         
  return data;
}

export const listenForImages = (sessionId: string): void => {
  const images = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'images',
      filter: `session_id=eq.${sessionId}`
    },
    (payload) => {
      console.log('Change received!', payload)
      return payload
    }
  )
  .subscribe()
};