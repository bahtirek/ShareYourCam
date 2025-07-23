import { View, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import React from 'react'
import icons from '@constants/Icons';

type SourceType = {
  source: ImageSourcePropType
}

const DownloadImage = ({source}: SourceType) => {
  const download = () => {
    console.log('download', source);
    
  }

  return (
    <View className='absolute bottom-16 w-full items-center'>
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