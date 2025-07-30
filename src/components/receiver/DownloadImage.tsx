import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import icons from '@constants/Icons';
import { saveToMediaLibrary, getUri } from '@/services/MediaService';
import { shareAsync } from 'expo-sharing';
import { SignedUrlType } from '@/types';
import { deleteImageFromBucket } from '@/services/ImageServices';
import { deleteImageFromDB } from '@/api/images';
import { useImage } from '@/providers/ImagesProvider';

type SourceType = {
  url: SignedUrlType
}

const DownloadImage = ({url}: SourceType) => {
  const { removeImageURL } = useImage();

  const download = async() => {
    //show spinner
    const result = await saveToMediaLibrary(url);
    //hide spinner
    if(result && result.success) {    
      await deleteFromCloud(url.path)
      //if success show toast
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
        removeImageURL(path)
        return true
      }
    } 
    return false
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