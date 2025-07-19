import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { getAllImages, getImageAsUrl, getImageAsUrls, listenImagesChannel } from '@/api/images';
import { ImageType } from "@/types";
import { router } from "expo-router";

type ImageProviderType = {
  getAllImageURLs: (appId: string) => void;
  listenForImages: (sessionId: number) => void;
  addImageURLs: (imageData: ImageType) => void;
  resetImageReceiving: () => void;
  imageReceivingStarted: boolean
  signedUrls: ImageType[]
}

export const ImageContext = createContext<ImageProviderType>({
  getAllImageURLs: () => ({}),
  listenForImages: () => ({}),
  addImageURLs: () => ({}),
  resetImageReceiving: () => ({}),
  signedUrls: [],
  imageReceivingStarted: false
});


const ImageProvider = ({children}: PropsWithChildren) => { 
  const [signedUrls, setSignedUrls] = useState<any>([])
  const [imageReceivingStarted, setImageReceivingStarted] = useState(false)
  let navigation = false;

  const getAllImageURLs = async(appId: string) => {
    if(appId) {
      const data = await getAllImages(appId);
      const urls = data.data.map((item: any) => item.url)
      
      if(urls && urls.length > 0 ) {
        const signedUrlsArray = await getImageAsUrls(urls);
        setSignedUrls(signedUrlsArray)
      }
    }
  }

  const listenForImages = (sessionDBId: number) => {
    console.log('listening', sessionDBId);
    navigation = false;

    listenImagesChannel()
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'images',
          filter: `sessions_id=eq.${sessionDBId}`
        },
        (payload) => {
          console.log('Change received!', payload);
          setImageReceivingStarted(true);
          getNewImageSignedUrl(payload.new.url)
        }
      )
      .subscribe()
  }
    
  const getNewImageSignedUrl = async (url: string) => {
    const signedUrl = await getImageAsUrl(url);  
    setSignedUrls((prevURLs: ImageType[]) => [...prevURLs, signedUrl]);
  }

  const resetImageReceiving = () => {
    setImageReceivingStarted(false)
  }

  const addImageURLs = async (imageData: ImageType) => {
    setSignedUrls((prevUrls: ImageType[]) => [...prevUrls, imageData])
  }

  return (
    <ImageContext.Provider value={{getAllImageURLs, addImageURLs, listenForImages, resetImageReceiving, signedUrls, imageReceivingStarted}}>
      {children}
    </ImageContext.Provider>
  )
}

export default ImageProvider;

export const useImage = () => useContext(ImageContext)