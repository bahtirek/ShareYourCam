import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import React from 'react'

type IconButtonType = {
  icon: ImageSourcePropType | undefined,
  handlePress: () => void
  className?: string,
  imageClassName?: string,
}

const IconButton = ({icon, handlePress, className, imageClassName = '!w-6 !h-6'}: IconButtonType) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`w-12 h-12 items-center justify-center ${className}`}
    >
        <Image 
          source={icon}
          className={imageClassName}
          resizeMode='cover'
        />
    </TouchableOpacity>
  )
}

export default IconButton