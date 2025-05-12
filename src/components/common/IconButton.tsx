import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import React from 'react'

type IconButtonType = {
  icon: ImageSourcePropType | undefined,
  handlePress: () => void
  className?: string,
}

const IconButton = ({icon, handlePress, className}: IconButtonType) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`w-12 h-12 items-center justify-center ${className}`}
    >
        <Image 
          source={icon}
          className='!w-6 !h-6'
          resizeMode='cover'
        />
    </TouchableOpacity>
  )
}

export default IconButton