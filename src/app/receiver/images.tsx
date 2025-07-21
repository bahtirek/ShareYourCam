import { View, StyleSheet } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImage } from '@/providers/ImagesProvider';
import ImageModal from 'react-native-image-modal';
import React from 'react';

export default function HomeScreen() {
  const { signedUrls } = useImage();

  return (
    <SafeAreaView className='w-full'>
      <View className='flex-row gap-3 py-20 px-8 flex-wrap w-[356px] mx-auto'>
        {
          signedUrls.map((url: any, index) => {
            return (
              <View style={styles.imageContainer} key={index}>
                <ImageModal
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
                />
              </View>
            )
          })
        }
      </View>
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