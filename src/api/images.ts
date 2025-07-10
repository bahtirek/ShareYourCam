import { supabase } from "@/lib/supabase";

export const insertImageData = async (receiverSessionId: string, url: string) => {
  console.log('inserting image dtat', receiverSessionId, url);
         
  try {
    const { data, error } = await supabase
      .rpc('add_image_data', {
        p_session_id: receiverSessionId,
        p_url: url
      })
    
    if (error) throw error
    
    console.log('Image record created:', data)
    return data
  } catch (error) {
    console.error('Error creating image record:', error)
    throw error
  }
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

export const getAllImages = async (id: string) => {
  const { data, error }: any = await supabase
    .from('user_app')
    .select('*')
    .eq('appId', id)

    if(error) {
      throw new Error(error.message);
    }
  return data;
}
