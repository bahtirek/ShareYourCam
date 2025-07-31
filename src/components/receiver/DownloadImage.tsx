import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import icons from '@constants/Icons';
import { SignedUrlType } from '@/types';

type SourceType = {
  url: SignedUrlType,
  onDownload: any
}

const DownloadImage = ({url, onDownload}: SourceType) => {

  const download = async() => {
    onDownload(url)
  }

  return (
    <View className='absolute bottom-10 w-full items-center'>
      <TouchableOpacity
        onPress={download}
        className='w-12 h-12 items-center justify-center bg-white/40 rounded-md'
      >
        <Image 
          source={icons.download}
          className='!w-6 !h-6'
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  )
}

export default DownloadImage