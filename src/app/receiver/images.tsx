import { View, StyleSheet, ScrollView, Modal, Text, Platform, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImage } from '@/providers/ImagesProvider';
import ImageModal, { ReactNativeImageModal } from 'react-native-image-modal';
import React, { useEffect, useRef, useState } from 'react';
import { SignedUrlType } from '@/types';
import Toast, { ToastData, ToastType } from 'react-native-toast-message';
import { deleteImageFromBucket } from '@/services/ImageServices';
import { deleteImageFromDB } from '@/api/images';
import { saveToMediaLibrary, getUri } from '@/services/MediaService';
import { shareAsync } from 'expo-sharing';
import DownloadImage from '@/components/receiver/DownloadImage';
import { Image, ImageContentFit } from 'expo-image';
import CustomButton from '@/components/common/CustomButton';


export default function HomeScreen() {
  const { signedUrls, removeImageURL } = useImage();
  const imageModal = useRef<ReactNativeImageModal>(null);
  const [showModal, setShowModal] = useState(false);
  const [shareAsyncCompleted, setShareAsyncCompleted] = useState(false);

  useEffect(() => { 
    if(shareAsyncCompleted) {
      setShowModal(true)
    }
  }, [shareAsyncCompleted])

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
      imageModal.current?.close();
      setTimeout(() => {
        setShareAsyncCompleted(true)
      }, 500);
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

  const redeemed = () => {
    setShowModal(false)
    setShareAsyncCompleted(false)
  }

  return (
    <SafeAreaView className='w-full'>
      <ScrollView className=''>
         <CustomButton label='Rescan' handlePress={redeemed} />
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
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
        >
        <View className='h-full w-full justify-center items-center bg-black/40 pb-16'>
          <View className='w-[85%] p-6 rounded-xl bg-white'  style={styles.shadow}>
            <Text className='text-xl text-primary-700 font-pregular mb-6'>Oops!</Text>
            <View className='flex flex-row justify-between mb-12'>
              <Text className='text-lg text-secondary-600 font-pregular'>Couldn't redeem. Please try again.</Text>
            </View>
            <CustomButton label='Rescan' handlePress={redeemed} />
          </View>
        </View>
      </Modal>
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
  shadow: {
    shadowColor: "rgba(152, 152, 152, 0.5)",
    shadowOffset: {
        width: 0,
        height: 7,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7,

    elevation: 10,
    ...Platform.select({
      android: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOpacity: 1,
      }
    })
  }
});