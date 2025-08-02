import { createContext, PropsWithChildren, useContext, useState } from "react";
import { deleteImageFromDB, getAllImages, getImageAsUrl, getImageAsUrls, listenImagesChannel } from '@/api/images';
import { SignedUrlType } from "@/types";
import { router } from "expo-router";
import { deleteFromBucket } from "@/api/bucket";

type ImageProviderType = {
  getAllImageURLs: (appId: string) => void;
  listenForImages: (sessionId: number) => void;
  addImageURLs: (imageData: SignedUrlType) => void;
  resetImageReceiving: () => void;
  removeImageURL: (path: string) => void;
  showImageModal: (imageData: SignedUrlType) => void;
  deleteImageFromCloud: (path: string) => Promise<Boolean | undefined>,
  imageReceivingStarted: boolean
  signedUrls: SignedUrlType[],
  currentUrl: SignedUrlType,
  signedThumbnailUrls: SignedUrlType[],
}

export const ImageContext = createContext<ImageProviderType>({
  getAllImageURLs: () => ({}),
  listenForImages: () => ({}),
  addImageURLs: () => ({}),
  resetImageReceiving: () => ({}),
  removeImageURL: () => ({}),
  showImageModal: () => ({}),
  deleteImageFromCloud: (async () => (false)),
  signedUrls: [],
  signedThumbnailUrls: [],
  imageReceivingStarted: false,
  currentUrl: {}
});


const ImageProvider = ({children}: PropsWithChildren) => { 
  const [signedUrls, setSignedUrls] = useState<any>([])
  const [currentUrl, setCurrentUrl] = useState<SignedUrlType>({})
  const [signedThumbnailUrls, setSignedThumbnailUrls] = useState<any>([])
  const [imageReceivingStarted, setImageReceivingStarted] = useState(false)
  let navigation = false;

  const getAllImageURLs = async(appId: string) => {
    if(appId) {
      const data = await getAllImages(appId);
      const urls = data.data.map((item: any) => item.url);      
      
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
    
  const getNewImageSignedUrl = async (path: string) => {
    console.log('getNewImage', path);
    
    const signedThumbnailUrl = await getImageAsUrl(path, 'thumbnails'); 
    const signedUrl: SignedUrlType = await getImageAsUrl(path, 'images');
    signedUrl.path = path;
    signedThumbnailUrl.path = path;
    setSignedThumbnailUrls((prevURLs: SignedUrlType[]) => [...prevURLs, signedThumbnailUrl, ]);
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
    setSignedThumbnailUrls((prevUrls: SignedUrlType[]) => {
      return prevUrls.filter((item: SignedUrlType) => item.path != path)
    })
  }

  const showImageModal = async(url: SignedUrlType) => {
    const signedUrl: SignedUrlType = await getImageAsUrl(url.path!, 'images');
    setCurrentUrl({...signedUrl, path: url.path});
    router.navigate('/image-modal')
  }

  const deleteImageFromCloud = async (path: string) => {
    const deleteImageFromDBResult = await deleteImageFromDB(path);
    if(deleteImageFromDBResult.success) {
      const deleteImageFromBucketResult = await deleteFromBucket(path, 'images');
      if(deleteImageFromBucketResult.success) {
        await deleteFromBucket(path, 'thumbnails');
        removeImageURL(path);
        return true
      }
    } 
    return false
  }

  return (
    <ImageContext.Provider value={{getAllImageURLs, addImageURLs, listenForImages, resetImageReceiving, removeImageURL, showImageModal, deleteImageFromCloud, currentUrl, signedThumbnailUrls, signedUrls, imageReceivingStarted}}>
      {children}
    </ImageContext.Provider>
  )
}

export default ImageProvider;

export const useImage = () => useContext(ImageContext)