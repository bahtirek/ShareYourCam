import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import icons from '@constants/Icons';
import { saveToMediaLibrary, getUri } from '@/services/MediaService';
import { shareAsync } from 'expo-sharing';
import { SignedUrlType } from '@/types';

type SourceType = {
  url: SignedUrlType
}

const DownloadImage = ({url}: SourceType) => {
  const download = async() => {
    //show spinner
    const result = await saveToMediaLibrary(url);
    //hide spinner
    if(result && result.success) {
      //delete from cloud
    } else {
      const uri = await getUri(url)
      await shareAsync(uri)
      // show modal with option to remove the file from a cloud
    }
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