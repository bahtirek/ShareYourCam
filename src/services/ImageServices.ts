import { supabase } from "@/lib/supabase";

type SendResult = {
  success: boolean;
  message?: string;
  url?: string
}

// Actual implementation using Firebase
export const sendImageToReceiver = async (
  imageUri: string,
  receiverSessionId: string
): Promise<SendResult> => {
  try {
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    // Generate a unique file name
    const filename = `${receiverSessionId}/${Date.now()}.jpg`;

    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(filename, arrayBuffer, { contentType: 'image/jpeg', upsert: false });

    console.log("storage data ",data);
    console.log("error", error);
    if(error) {
      console.error('Error sending image:', error);
      return { 
        success: false, 
        message: error instanceof Error? error.message : 'Unknown error occurred'
      };
    }
    
    return { success: true, url: filename };
  } catch (error) {
    console.error('Error sending image:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
