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

export const listenImagesChannel = () => {
  return supabase.channel('custom-insert-channel')
};

export const getImageAsUrls = async (filePaths: string[]) => {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .createSignedUrls(filePaths, 3600)
    
    if (error) {
      throw error
    }
     console.log('urls', data);
     
    return data
  } catch (error) {
    console.error('getImageAsUrls, Error downloading image:', error)
    throw error
  }
}

export const getImageAsUrl = async (filePath: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('images')
      .createSignedUrl(filePath, 3600)
    
    if (error) {
      throw error
    }
    
    return data
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
    
    // data is already a Blob object
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
    console.log("images1", data, appId);

    return data
  } catch (error) {
    console.error('Error on getting urls:', error)
    throw error
  }
}
