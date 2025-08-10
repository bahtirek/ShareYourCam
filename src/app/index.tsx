import { Image, StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { useImage } from '@/providers/ImagesProvider';

export default function HomeScreen() {
  const { downloadAllPendingImages, pendingImages } = useImage();
  const { session } = useSession();
  const [totalImages, setTotalImages] = useState<number>(0);
  const screenHeight = Dimensions.get('screen').height;
    
  useEffect(() => { 
    getAllImages()
  }, [session])

  const goToScanQrCode = () => {
    router.navigate('/sender/scan-qrcode')
  }

  const goToImages = () => {
    router.navigate('/receiver/images')
  }
  
  const goToGenerateQrCode = () => {
    router.navigate('/receiver/generate-qrcode')
  }

  const getAllImages = async() => {
    if(session.appId) {
      await downloadAllPendingImages(session.appId);
      setTotalImages(pendingImages.length)
    }
  }

  return (
    <SafeAreaView className='h-full w-full justify-between items-center'>
      <View className='h-full w-full'>
        <View className='h-[220] w-[220] m-auto'>
          <View className='absolute top-[20%]'>
            <TouchableOpacity
              onPress={goToScanQrCode}
              className='w-14 h-16 items-center justify-center'
            >
              <Image 
                source={icons.shutter}
                className='!w-14 !h-14'
                resizeMode='contain'
              />
              <Text className='text-sm text-center' style={styles.colorOrange}>Share</Text>
            </TouchableOpacity>
          </View>
          <View className='absolute top-[20%] right-0'>
            <TouchableOpacity
              onPress={goToGenerateQrCode}
              className='w-14 h-16 items-center justify-center'
            >
              <Image 
                source={icons.qr_code}
                className='!w-14 !h-14'
                resizeMode='contain'
              />
              <Text className='text-sm text-center' style={styles.colorBlue}>Receive</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className='items-center justify-center absolute bottom-6 w-full'>
          {
            totalImages > 0 &&
            <TouchableOpacity onPress={goToImages}>
              <Text style={{ color: '#3674B5', fontSize: 18 }}>{totalImages} pending downloads</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  colorViolet: {
    color: "palevioletred"
  },
  colorOrange: {
    color: 'orange'
  },
  colorBlue: {
    color: "dodgerblue"
  },
});