import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { getAllImages, getImageAsUrls } from '@/api/images';
import { ImageType } from "@/types";

type ImageProviderType = {
  getAllImageURLs: (appId: string) => void;
  addImageURLs: (imageData: ImageType) => void;
  signedUrls: ImageType[]
}

export const ImageContext = createContext<ImageProviderType>({
  getAllImageURLs: () => ({}),
  addImageURLs: () => ({}),
  signedUrls: []
});


const ImageProvider = ({children}: PropsWithChildren) => { 
  const [signedUrls, setSignedUrls] = useState<any>([])

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

  const addImageURLs = async (imageData: ImageType) => {
    setSignedUrls((prevUrls: ImageType[]) => [...prevUrls, imageData])
  }

  return (
    <ImageContext.Provider value={{getAllImageURLs, addImageURLs, signedUrls}}>
      {children}
    </ImageContext.Provider>
  )
}

export default ImageProvider;

export const useImage = () => useContext(ImageContext)