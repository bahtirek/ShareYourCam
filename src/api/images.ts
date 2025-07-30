import { supabase } from "@/lib/supabase";
import { SignedUrlType } from "@/types";

export const insertImageData = async (receiverSessionId: string, url: string) => { 
  try {
    const { data, error } = await supabase
      .rpc('add_image_data', {
        p_session_id: receiverSessionId,
        p_url: url
      })
    
    if (error) throw error
    
    return data
  } catch (error) {
    console.error('Error creating image record:', error)
    throw error
  }
}

export const listenImagesChannel = () => {
  return supabase.channel('custom-insert-channel')
};

export const getImageAsUrls = async (filePaths: string[], storage: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(storage)
      .createSignedUrls(filePaths, 3600)
    
    if (error) {
      throw error
    }

    return data as SignedUrlType[]
  } catch (error) {
    console.error('getImageAsUrls, Error downloading image:', error)
    throw error
  }
}

export const getImageAsUrl = async (filePath: string, storage: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(storage)
      .createSignedUrl(filePath, 3600)
    
    if (error) {
      throw error
    }
    
    return data as SignedUrlType
  } catch (error) {
    console.error('getImageAsUrl, Error downloading image:', error)
    throw error
  }
}

export const getImageAsBlob = async (filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .download(filePath)
    
    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('getImageAsBlob, Error downloading image:', error)
    throw error
  }
}

export const getAllImages = async (appId: string) => {
  try {
    const { data, error } = await supabase
    .rpc('get_urls_by_app_id', {
      p_app_id: appId
    });
    
    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error on getting urls:', error)
    throw error
  }
}

export const deleteImageFromDB = async (url: string) => {
  try {
    const { data, error } = await supabase
    .rpc('delete_image_and_check_session', {
      input_url: url
    });
    
    if (error) {
      throw error
    }
    console.log('delete image', data);
    
    return data
  } catch (error) {
    console.error('Error on getting urls:', error)
    throw error
  }
}
