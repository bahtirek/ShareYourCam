import { TouchableOpacity, ImageSourcePropType, Text, Modal, View } from 'react-native'
import React from 'react'
import { AlertModalType } from '@/types';


const AlertModal = ({title, text, actions, showModal}: AlertModalType) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
    >
      <View className='h-full w-full justify-center items-center bg-black/40 '>
        <View className='w-[300px] h-[180px] bg-white px-8 py-6'>
          <View>
            <Text className="text-xl mb-2">{title}</Text>
            <Text className="text-lg">{text}</Text>
          </View>
          <View className='flex-row mt-auto'>
            {
              actions.map((actionItem: any) => {
                return (
                  <TouchableOpacity onPress={actionItem.onPress} key={actionItem.label} className='col flex-1'>
                    <Text className={`${actionItem.style} bg-blue text-xl text-center`}>{actionItem.label}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default AlertModal