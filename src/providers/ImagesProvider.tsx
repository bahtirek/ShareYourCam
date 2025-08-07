import { createContext, PropsWithChildren, useContext, useState } from "react";
import { deleteImageFromDB, getAllImages, getImageAsUrl, getImageAsUrls, listenImagesChannel } from '@/api/images';
import { SignedUrlType, Status } from "@/types";
import { router } from "expo-router";
import { deleteFromBucket } from "@/api/bucket";
import { getLastSavedImageFromAlbum, saveToMediaLibrary } from "@/services/MediaService";

type ImageProviderType = {
  downloadAllPendingImages: (appId: string) => void;
  listenForImages: (sessionId: number) => void;
  resetImageReceiving: () => void;
  removeImageURL: (path: string) => void;
  showImageModal: (imageData: SignedUrlType) => void;
  deleteImageFromCloud: (path: string) => Promise<Boolean | undefined>,
  downloadNewImage: (path: string) => void;
  setReceivedImages: (imagesData: SignedUrlType[]) => void;
  imageReceivingStarted: boolean
  pendingImages: SignedUrlType[],
  currentUrl: SignedUrlType,
  receivedImages: SignedUrlType[],
}

export const ImageContext = createContext<ImageProviderType>({
  downloadAllPendingImages: () => ({}),
  listenForImages: () => ({}),
  resetImageReceiving: () => ({}),
  removeImageURL: () => ({}),
  showImageModal: () => ({}),
  deleteImageFromCloud: (async () => (false)),
  downloadNewImage: () => ({}),
  setReceivedImages: () => ({}),
  pendingImages: [],
  imageReceivingStarted: false,
  currentUrl: {},
  receivedImages: [],
});


const ImageProvider = ({children}: PropsWithChildren) => { 
  const [currentUrl, setCurrentUrl] = useState<SignedUrlType>({})
  const [pendingImages, setPendingImages] = useState<any>([])
  const [imageReceivingStarted, setImageReceivingStarted] = useState(false)
  const [showLoader, setShowLoader] = useState(false);
  const [receivedImages, setReceivedImages] = useState<SignedUrlType[]>([]);

  const getAllImageURLs = async(appId: string) => {
    if(appId) {
      const data = await getAllImages(appId);
      const urls = data.data.map((item: any) => item.url);      
      
      if(urls && urls.length > 0 ) {
        return await getImageAsUrls(urls, 'thumbnails');       
      } else {
        return []
      }
    } else {
      return []
    }
  }

  const listenForImages = (sessionDBId: number) => {
    console.log('listening', sessionDBId);

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
          downloadNewImage(payload.new.url)
        }
      )
      .subscribe()
  }
  
  const downloadNewImage = async(path: string) => {
    const signedUrl: SignedUrlType = await getImageAsUrl(path, 'images');
    signedUrl.path = path;

    getThumbnailSignedUrl(signedUrl.path!)
    const result = await saveToMediaLibrary(signedUrl);
    
    if(result && result.success) {
      setImageFromAlbum(signedUrl.path)
    }
  } 

  const getThumbnailSignedUrl = async (path: string) => {
    const signedThumbnailUrl = await getImageAsUrl(path, 'thumbnails'); 

    signedThumbnailUrl.path = path;
    signedThumbnailUrl.status = Status.Pending;
    setReceivedImages((prevURLs: SignedUrlType[]) => [...prevURLs, signedThumbnailUrl, ]);
  }

  const setImageFromAlbum = async(path: string) => {
    const lastSavedImage = await getLastSavedImageFromAlbum();
    let localUri = ''
    if(lastSavedImage && lastSavedImage.uri) localUri = lastSavedImage.uri

    setReceivedImages((prevURLs: SignedUrlType[]) => {
      return prevURLs.map((url: SignedUrlType) => {
        if (url.path == path) {
          return {...url, status: Status.Received, localUrl: localUri}
        }
        return url
      })
    });

    await deleteImageFromCloud(path)
  }

  const resetImageReceiving = () => {
    setImageReceivingStarted(false)
  }

  const removeImageURL = async (path: string) => {
    setPendingImages((prevUrls: SignedUrlType[]) => {
      return prevUrls.filter((item: SignedUrlType) => item.path != path)
    })
  }

  const showImageModal = async(url: SignedUrlType) => {   
    if(url.localUrl) {
      setCurrentUrl({...url, path: url.path, signedUrl: url.localUrl});
    } else {
      const signedUrl: SignedUrlType = await getImageAsUrl(url.path!, 'images');
      setCurrentUrl({...signedUrl, path: url.path});
    }
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

  const downloadAllPendingImages = async (appId: string) => {
    const imagesToDownload: SignedUrlType[] = await getAllImageURLs(appId);
    
    for (const image of imagesToDownload) {
      if(!image.path) return;
      const signedUrl: SignedUrlType = await getImageAsUrl(image.path, 'images');
      signedUrl.path = image.path;
      const result = await saveToMediaLibrary(signedUrl);     
      if(result) await deleteImageFromCloud(image.path); 
    }
    const pending: SignedUrlType[] = await getAllImageURLs(appId);  
    setPendingImages(pending);
  }

  return (
    <ImageContext.Provider value={{
      listenForImages, 
      resetImageReceiving, 
      removeImageURL, 
      showImageModal, 
      deleteImageFromCloud,
      downloadNewImage,
      setReceivedImages,
      downloadAllPendingImages,
      receivedImages, 
      currentUrl,
      pendingImages, 
      imageReceivingStarted}}
    >
      {children}
    </ImageContext.Provider>
  )
}

export default ImageProvider;

export const useImage = () => useContext(ImageContext)