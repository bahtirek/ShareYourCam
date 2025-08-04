import { View, StyleSheet, Modal, Text, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImage } from '@/providers/ImagesProvider';
import React, { useEffect, useState } from 'react';
import Toast, { ToastData, ToastType } from 'react-native-toast-message';
import { saveToMediaLibrary, getUri } from '@/services/MediaService';
import { shareAsync } from 'expo-sharing';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import IconButton from '@/components/common/IconButton';
import icons from '@constants/Icons';
import Loader from '@/components/common/Loader';
import { Status } from '@/types';


export default function ImageModal() {
  const { currentUrl, deleteImageFromCloud } = useImage();
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const showToast = (toastType: ToastType, toastContent: ToastData) => {
    Toast.show({
      type: toastType,
      text1: toastContent.text1,
      text2: toastContent.text2
    });
  }
  
  useEffect(() => {    
  }, [currentUrl])

  const onDownload = async() => {
    setShowLoader(true)
    const result = await saveToMediaLibrary(currentUrl);
    setShowLoader(false)
    if(result && result.success) {    
      await onDeleteFromCloud(currentUrl.path!)
    } else {
      const uri = await getUri(currentUrl)
      await shareAsync(uri);
      await setShowModal(true)
    }
  }

  const onDeleteFromCloud = async(path: string) => {
    setShowModal(false);
    setShowLoader(true)
    const deleteResult = await deleteImageFromCloud(path);
    if(deleteResult) {
      setShowLoader(false)
      const isPresented = router.canGoBack();
      router.back();
      showToast('success', {text1: 'Success', text2: 'Image has been deleted from Cloud'})
    }
  }
  
  return (
    <SafeAreaView className='w-full h-full relative'>
        <View className='py-20 w-full h-full'>
          <Image
            style={{width: '100%', height: '100%'}}
            source={{uri: currentUrl.signedUrl}}
            contentFit="contain"
            transition={1000}
            scale-down='none'
            allowDownscaling={false}
            /> 
        </View>
        {
          !(currentUrl.status && currentUrl.status == Status.Received) &&
          <View className='flex-row justify-center align-center absolute bottom-14 w-full'>
            <IconButton
              icon={icons.download}
              handlePress={onDownload}
              imageClassName='!w-10 !h-10'
              className='p-3 rounded bg-white/50'
            />
          </View>
        }
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
        >
          <View className='h-full w-full justify-center items-center bg-black/40 pb-16'>
            <View className='w-[85%] p-6 rounded-xl bg-white'  style={styles.shadow}>
              <Text className='text-xl font-pregular mb-6 text-secondary-900' >Delete image from "Cloud"</Text>
              <View className='flex flex-row justify-between mb-12'>
                <Text className='text-lg text-secondary-600 font-pregular'>Delete this image permanently? Only proceed if you've confirmed it saved successfully to your device. This action cannot be undone.</Text>
              </View>
              <View className='items-center justify-center'>
                <TouchableOpacity onPress={() => onDeleteFromCloud(currentUrl.path!)}>
                  <Text style={{ color: '#3674B5', fontSize: 18 }}>Yes, Delete Image</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text style={{ color: '#db7093', fontSize: 16, marginTop: 24 }}>No, Keep Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Loader show={showLoader}/>
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