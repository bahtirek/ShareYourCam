import { View, StyleSheet, ScrollView } from 'react-native';
import { ImageContentFit } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImage } from '@/providers/ImagesProvider';
import ImageModal from 'react-native-image-modal';
import React from 'react';
import ImageWrap from '@/components/receiver/ImageWrap';
import { SignedUrlType } from '@/types';

export default function HomeScreen() {
  const { signedUrls } = useImage();

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
                    isTranslucent={false}
                    style={{width: 64, height: 64}}
                    source={{uri: `${url.signedUrl}`}}
                    resizeMode="cover"
                    modalImageResizeMode="contain"
                    renderImageComponent={({source, resizeMode, style}) => (
                      <ImageWrap
                        style={style}
                        source={source}
                        contentFit={resizeMode as ImageContentFit}
                        url={url}
                      />
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