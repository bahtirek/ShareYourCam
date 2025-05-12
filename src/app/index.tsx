import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const share = () => {
    router.navigate('/sender/scan-qrcode')
  }
  
  const receive = () => {
    router.navigate('/receiver/generate-qrcode')
  }

  return (
    <SafeAreaView className='h-full w-full'>
      <View className='h-full justify-between items-center'>
        <View className='h-full w-full justify-around items-center flex-row'>
          <View>
            <TouchableOpacity
              onPress={share}
              className='w-12 h-12 items-center justify-center'
            >
              <Image 
                source={icons.camera}
                className='!w-20 !h-14'
                resizeMode='contain'
              />
              <Text className='text-md text-center'>Share</Text>
            </TouchableOpacity>
          </View>
          <View>
          <TouchableOpacity
              onPress={receive}
              className='w-12 h-12 items-center justify-center'
            >
              <Image 
                source={icons.folder}
                className='!w-20 !h-14'
                resizeMode='contain'
              />
              <Text className='text-md text-center'>Receive</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
