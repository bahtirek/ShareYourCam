import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { getAllImages, getImageAsUrl, getImageAsUrls, listenImagesChannel } from '@/api/images';
import { ImageType } from "@/types";

type ImageProviderType = {
  getAllImageURLs: (appId: string) => void;
  listenForImages: (sessionId: number) => void;
  addImageURLs: (imageData: ImageType) => void;
  resetImageReceiving: () => void;
  imageReceivingStarted: boolean
  signedUrls: ImageType[],
  signedThumbnailUrls: ImageType[],
}

export const ImageContext = createContext<ImageProviderType>({
  getAllImageURLs: () => ({}),
  listenForImages: () => ({}),
  addImageURLs: () => ({}),
  resetImageReceiving: () => ({}),
  signedUrls: [],
  signedThumbnailUrls: [],
  imageReceivingStarted: false
});


const ImageProvider = ({children}: PropsWithChildren) => { 
  const [signedUrls, setSignedUrls] = useState<any>([])
  const [signedThumbnailUrls, setSignedThumbnailUrls] = useState<any>([])
  const [imageReceivingStarted, setImageReceivingStarted] = useState(false)
  let navigation = false;

  const getAllImageURLs = async(appId: string) => {
    if(appId) {
      const data = await getAllImages(appId);
      const urls = data.data.map((item: any) => item.url)
      
      if(urls && urls.length > 0 ) {
        const signedThumbnailUrlsArray = await getImageAsUrls(urls, 'thumbnails');
        const signedUrlsArray = await getImageAsUrls(urls, 'images');
        setSignedThumbnailUrls(signedThumbnailUrlsArray)
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
    const signedThumbnailUrl = await getImageAsUrl(url, 'thumbnails'); 
    const signedUrl = await getImageAsUrl(url, 'images'); 
    setSignedThumbnailUrls((prevURLs: ImageType[]) => [...prevURLs, signedThumbnailUrl]);
    setSignedUrls((prevURLs: ImageType[]) => [...prevURLs, signedUrl]);
  }

  const resetImageReceiving = () => {
    setImageReceivingStarted(false)
  }

  const addImageURLs = async (imageData: ImageType) => {
    setSignedUrls((prevUrls: ImageType[]) => [...prevUrls, imageData])
  }

  return (
    <ImageContext.Provider value={{getAllImageURLs, addImageURLs, listenForImages, resetImageReceiving, signedThumbnailUrls, signedUrls, imageReceivingStarted}}>
      {children}
    </ImageContext.Provider>
  )
}

export default ImageProvider;

export const useImage = () => useContext(ImageContext)