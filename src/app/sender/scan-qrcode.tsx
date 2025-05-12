import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';

export default function HomeScreen() {
  const share = () => {

  }
  
  const receive = () => {

  }

  return (
    <SafeAreaView className='h-full w-full'>
      <View className='h-full justify-between items-center'>
        <View className='h-full w-full justify-around items-center flex-row'>
          <View>
            <Text className='text-md text-center'>QR code scanner</Text>
          </View>
          <View>
              <Text className='text-md text-center'>Receive</Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
