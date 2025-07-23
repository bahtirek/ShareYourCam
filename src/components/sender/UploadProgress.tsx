import { View, Text, Image, ActivityIndicator } from 'react-native'
import React from 'react'

const UploadProgress = ({ uri }: any) => {
  return (
    <View>
    {
      uri &&
      <View className='relative py-[3px] px-[2px]'>
        <View className='w-14 h-14 bg-white/50 rounded-lg' ></View>
        <View className='flex-row items-center -mt-14 pt-1 pl-1'>
          <Image source={{uri: uri}} className='!w-12 !h-12 rounded-md' />
          <ActivityIndicator size={'small'} color={"#FF4416"} className='-ml-9'/>
        </View>
      </View>
    }
    </View>
  )
}

export default UploadProgress