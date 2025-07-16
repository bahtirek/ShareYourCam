import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { getAllImages, getImageAsUrls } from '@/api/images';
import { useSession } from '@/providers/SessionProvider';
import { ImageType } from "@/types";

type ImageProviderType = {
  getAllImageURLs: (appId: string) => void;
  signedUrls: ImageType[]
}

export const ImageContext = createContext<ImageProviderType>({
  getAllImageURLs: () => ({}),
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
  return (
    <ImageContext.Provider value={{getAllImageURLs, signedUrls}}>
      {children}
    </ImageContext.Provider>
  )
}

export default ImageProvider;

export const useImage = () => useContext(ImageContext)