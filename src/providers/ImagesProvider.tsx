import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { SessionType } from '@/types';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { PermissionsAndroid, Platform, Alert} from 'react-native';

type ImageProviderType = {
  images: string[],
  saveImageWithBlobUtil: (imageUrl: string) => void;
}

export const ImageContext = createContext<ImageProviderType>({
  images: [],
  saveImageWithBlobUtil: () => ({})
});


const ImageProvider = ({children}: PropsWithChildren) => {
  const [savedImagePath, setSavedImagePath] = useState('');
  const [images, setImages] = useState<string[]>([])

  const saveImageWithBlobUtil = async (imageUrl: string) => {
    const fileName = `share_your_cam_${Date.now()}.jpg`;
    console.log("fileName", fileName);
    
    try {
      // Request permissions for Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied');
          return;
        }
      }

      const { config, fs } = ReactNativeBlobUtil;
      const downloads = fs.dirs.DownloadDir; // Android
      const documents = fs.dirs.DocumentDir; // iOS
      
      const path = Platform.OS === 'ios' ? documents : downloads;
      const filePath = `${path}/${fileName}`;

      const configOptions = Platform.select({
        ios: {
          fileCache: true,
          path: filePath,
        },
        android: {
          fileCache: true,
          path: filePath,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: filePath,
            description: 'Downloading image...',
          },
        },
      });

      const response = await config(configOptions!).fetch('GET', imageUrl);
      
      if (Platform.OS === 'ios') {
        Alert.alert('Success', `Image saved to: ${response.path()}`);
      } else {
        Alert.alert('Success', 'Image downloaded successfully!');
      }
      
      console.log(response.path());
      const savedImagePath: string = response.path();
      console.log("savedImagePath", savedImagePath);
      if(savedImagePath) setImages([...images, savedImagePath])
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert('Error', 'Failed to download image');
    }
  };

  return (
    <ImageContext.Provider value={{saveImageWithBlobUtil, images}}>
      {children}
    </ImageContext.Provider>

  )
}

export default ImageProvider;

export const useImage = () => useContext(ImageContext)
