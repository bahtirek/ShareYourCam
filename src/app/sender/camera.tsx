// screens/SenderScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera, CameraType, } from 'expo-camera';
import { useSession } from '@/providers/SessionProvider';
import { uploadImageToBucket, uploadThumbnailToBucket } from '@/api/bucket';
import { insertImageData } from '@/api/images';
import { router } from 'expo-router';
import UploadProgress from '@components/sender/UploadProgress'
import { createThumbnail } from '@/services/ThumbnailService';
import { ImageResult } from 'expo-image-manipulator';

type UploadProgressType = {
  thumbnail?: string,
  filename?: string
}

export default function SenderScreen() {
  const cameraRef = useRef<CameraView>(null);
  const { session, } = useSession();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [uploadProgressItems, setUploadProgressItems] = useState<UploadProgressType[]>([])

  useEffect(() => {
    if(session.receiverSessionId) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    } else {
      router.navigate('/');
    }
  }, []);

  const takePicture = async (): Promise<void> => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        if(!photo) return;
        sendImage(photo);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const sendImage = async (photo: any): Promise<void> => {
    const filename = `${session.receiverSessionId}/${Date.now()}.jpg`;
    try {
      const thumbnailResult: ImageResult = await createThumbnail(photo.uri);
      addUploadProgressItem(thumbnailResult.uri, filename);

      const imageUploadResult = await uploadImageToBucket(photo.uri, filename);
      await uploadThumbnailToBucket(thumbnailResult.uri, filename);

      if (imageUploadResult.success) {
        await insertImageData(session.receiverSessionId!, imageUploadResult.url!)
      } else {
        Alert.alert('Error', imageUploadResult.message || 'Failed to send image');
        removeUploadProgressItem(filename)
      }
    } catch (error) {
      console.error('Error sending image:', error);
      Alert.alert('Error', 'Failed to send image');
      removeUploadProgressItem(filename)
    } finally {
      removeUploadProgressItem(filename)
    }
  };

  const addUploadProgressItem = (thumbnail: string, filename: string) => {
    setUploadProgressItems((prevItems: UploadProgressType[]) => [...prevItems, {thumbnail, filename}])
  }

  const removeUploadProgressItem = (filename: string) => {
    setUploadProgressItems((prevItems: UploadProgressType[]) => {
      return prevItems.filter((item: UploadProgressType) => item.filename != filename)
    })
  }

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
        <View style={styles.container}>
          <View className='h-full'>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
            </CameraView>
            <View className='w-full h-20 absolute bottom-16 flex-1 justify-center items-center'>
              <TouchableOpacity className='w-20 h-20 bg-transparent border-2 rounded-full relative border-white flex justify-center items-center' onPress={takePicture}>
                <View className='h-16 w-16 bg-white rounded-full'></View>
              </TouchableOpacity>
            </View>
            <View className='absolute top-24 w-full'>
              <View className='flex-row m-auto flex-wrap w-[318px]'>
                {
                  uploadProgressItems.map((item: UploadProgressType) => {
                    return (
                        <UploadProgress uri={item.thumbnail} key={item.filename} />
                      )
                    })
                }
              </View>
            </View>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  }
});