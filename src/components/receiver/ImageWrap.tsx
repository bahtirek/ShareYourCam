import { Image, ImageContentFit, ImageStyle } from 'expo-image';
import React from 'react';
import { ImageSourcePropType, StyleProp, View } from 'react-native';
import DownloadImage from './DownloadImage';

type ImageType = {
  style: StyleProp<ImageStyle>,
  source: ImageSourcePropType,
  contentFit: ImageContentFit
}

const ImageWrap = ({style, source, contentFit}: ImageType) => {
  return (
    <View className='h-full w-full'>
      <Image
        style={style}
        source={source}
        contentFit={contentFit}
        transition={1000}
        scale-down='none'
        allowDownscaling={false}
      />
      {
        (contentFit != "cover") && 
        <DownloadImage source={source} />
      }
    </View>
  )
}

export default ImageWrap