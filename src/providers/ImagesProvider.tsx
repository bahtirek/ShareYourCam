import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { getAllImages, getImageAsUrl, getImageAsUrls, listenImagesChannel } from '@/api/images';
import { ImageType, SignedUrlType } from "@/types";

type ImageProviderType = {
  getAllImageURLs: (appId: string) => void;
  listenForImages: (sessionId: number) => void;
  addImageURLs: (imageData: SignedUrlType) => void;
  resetImageReceiving: () => void;
  removeImageURL: (path: string) => void;
  imageReceivingStarted: boolean
  signedUrls: SignedUrlType[],
  signedThumbnailUrls: SignedUrlType[],
}

export const ImageContext = createContext<ImageProviderType>({
  getAllImageURLs: () => ({}),
  listenForImages: () => ({}),
  addImageURLs: () => ({}),
  resetImageReceiving: () => ({}),
  removeImageURL: () => ({}),
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
    const signedUrl: SignedUrlType = await getImageAsUrl(url, 'images');
    signedUrl.path = url;
    setSignedThumbnailUrls((prevURLs: SignedUrlType[]) => [...prevURLs, signedThumbnailUrl]);
    setSignedUrls((prevURLs: SignedUrlType[]) => [...prevURLs, signedUrl]);
  }

  const resetImageReceiving = () => {
    setImageReceivingStarted(false)
  }

  const addImageURLs = async (imageData: SignedUrlType) => {
    setSignedUrls((prevUrls: SignedUrlType[]) => [...prevUrls, imageData])
  }

  const removeImageURL = async (path: string) => {
    setSignedUrls((prevUrls: SignedUrlType[]) => {
      return prevUrls.filter((item: SignedUrlType) => item.path != path)
    })
  }

  return (
    <ImageContext.Provider value={{getAllImageURLs, addImageURLs, listenForImages, resetImageReceiving, removeImageURL, signedThumbnailUrls, signedUrls, imageReceivingStarted}}>
      {children}
    </ImageContext.Provider>
  )
}

export default ImageProvider;

export const useImage = () => useContext(ImageContext)