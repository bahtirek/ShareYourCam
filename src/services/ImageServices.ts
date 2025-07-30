import { supabase } from "@/lib/supabase";

type SendResult = {
  success: boolean;
  message?: string;
  url?: string
}

export const uploadImageToBucket = async (
  imageUri: string,
  filename: string
): Promise<SendResult> => {
  try {
    const imageArrayBuffer = await convertImageUriToBlob(imageUri);       

    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(filename, imageArrayBuffer, { contentType: 'image/jpeg', upsert: false });

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

export const uploadThumbnailToBucket = async (
  thumbnailUri: string,
  filename: string
): Promise<SendResult> => {
  try {
    const thumbnailArrayBuffer = await convertImageUriToBlob(thumbnailUri);

    const { data, error } = await supabase
      .storage
      .from('thumbnails')
      .upload(filename, thumbnailArrayBuffer, { contentType: 'image/jpeg', upsert: false });

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

export const deleteImageFromBucket = async (
  filename: string
): Promise<SendResult> => {
  try {
    const { data, error } = await supabase
      .storage
      .from('images')
      .remove([filename]);

    if(error) {
      console.error('Error deleting image:', error);
      return { 
        success: false, 
        message: error instanceof Error? error.message : 'Unknown error occurred'
      };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};



export const convertImageUriToBlob = async(imageUri: string) => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const arrayBuffer = await new Response(blob).arrayBuffer();
  return arrayBuffer;
}