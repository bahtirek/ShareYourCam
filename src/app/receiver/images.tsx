import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImage } from '@/providers/ImagesProvider';
import React from 'react';
import { SignedUrlType } from '@/types';
import Toast, { ToastData, ToastType } from 'react-native-toast-message';
import { Image } from 'expo-image';


export default function HomeScreen() {
  const { pendingImages, showImageModal } = useImage();

  const showToast = (toastType: ToastType, toastContent: ToastData) => {
    Toast.show({
      type: toastType,
      text1: toastContent.text1,
      text2: toastContent.text2
    });
  }

  return (
    <SafeAreaView className='w-full'>
      <ScrollView className=''>
        <View className='py-20 w-full'>
          <View className='flex-row w-[304px] m-auto flex-wrap gap-4'>
          {
            pendingImages.map((url: SignedUrlType, index) => {
              return (
                <View style={styles.imageContainer} key={index}>
                  <TouchableOpacity
                    onPress={() => showImageModal(url)}
                    activeOpacity={0.7}
                  >
                    <Image
                      style={{width: 64, height: 64}}
                      source={{uri: `${url.signedUrl}`}}
                      contentFit="cover"
                      transition={1000}
                      scale-down='none'
                      allowDownscaling={false}
                    />
                  </TouchableOpacity>
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