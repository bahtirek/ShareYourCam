import { supabase } from "@/lib/supabase";

type SendResult = {
  success: boolean;
  message?: string;
}

// Actual implementation using Firebase
export const sendImageToReceiver = async (
  imageUri: string
): Promise<SendResult> => {
  try {
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    // Generate a unique file name
    const filename = `public/${Date.now()}.jpg`;
    const contentType = 'image/jpg';

    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(filename, arrayBuffer, { contentType: 'image/jpeg', upsert: false });

    console.log("data",data);
    console.log("error", error);
    if(error) {
      console.error('Error sending image:', error);
      return { 
        success: false, 
        message: error instanceof Error? error.message : 'Unknown error occurred'
      };
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from('images')
      .getPublicUrl(filename);

    console.log('public url', publicUrl);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending image:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
