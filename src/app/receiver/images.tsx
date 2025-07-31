import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImage } from '@/providers/ImagesProvider';
import ImageModal, { ReactNativeImageModal } from 'react-native-image-modal';
import React, { useRef } from 'react';
import { SignedUrlType } from '@/types';
import Toast, { ToastData, ToastType } from 'react-native-toast-message';
import { deleteImageFromBucket } from '@/services/ImageServices';
import { deleteImageFromDB } from '@/api/images';
import { saveToMediaLibrary, getUri } from '@/services/MediaService';
import { shareAsync } from 'expo-sharing';
import DownloadImage from '@/components/receiver/DownloadImage';
import { Image, ImageContentFit } from 'expo-image';


export default function HomeScreen() {
  const { signedUrls, removeImageURL } = useImage();
  const imageModal = useRef<ReactNativeImageModal>(null);

  const showToast = (toastType: ToastType, toastContent: ToastData) => {
    Toast.show({
      type: toastType,
      text1: toastContent.text1,
      text2: toastContent.text2
    });
  }

  const onDownload = async(url: SignedUrlType) => {
    //show spinner
    console.log('download test', url);

    const result = await saveToMediaLibrary(url);
    //hide spinner
    if(result && result.success) {    
      await deleteFromCloud(url.path)
    } else {
      const uri = await getUri(url)
      await shareAsync(uri);
      //await deleteImageFromBucket(url.path);
      // show modal with option to remove the file from a cloud
    }
  }

  const deleteFromCloud = async (path: string) => {
    const deleteImageFromDBResult = await deleteImageFromDB(path);
    if(deleteImageFromDBResult.success) {
      const deleteImageFromBucketResult = await deleteImageFromBucket(path);
      if(deleteImageFromBucketResult.success) {
        imageModal.current?.close();
        removeImageURL(path);
        showToast(
          'success',
          {
            text1: 'Success',
            text2: 'Image has been saved'
          }
        )
        return true
      }
    } 
    return false
  }

  return (
    <SafeAreaView className='w-full'>
      <ScrollView className=''>
        <View className='py-20 w-full'>
          <View className='flex-row w-[304px] m-auto flex-wrap gap-4'>
          {
            signedUrls.map((url: SignedUrlType, index) => {
              return (
                <View style={styles.imageContainer} key={index}>
                  <ImageModal
                    ref={imageModal}
                    isTranslucent={false}
                    style={{width: 64, height: 64}}
                    source={{uri: `${url.signedUrl}`}}
                    resizeMode="cover"
                    modalImageResizeMode="contain"
                    renderImageComponent={({source, resizeMode, style}) => (
                      <Image
                        style={style}
                        source={source}
                        contentFit={resizeMode as ImageContentFit}
                        transition={1000}
                        scale-down='none'
                        allowDownscaling={false}
                      />
                    )}
                    renderFooter={() => (
                      <DownloadImage url={url} onDownload={onDownload} />
                    )}
                  />
                </View>
              )
            })
          }
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
  },
});