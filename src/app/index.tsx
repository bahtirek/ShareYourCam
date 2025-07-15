import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';
import { router } from 'expo-router';
import { getAllImages, getImageAsUrls } from '@/api/images';
import { useEffect, useState } from 'react';
import { useSession } from '@/providers/SessionProvider';

export default function HomeScreen() {
  const [signedUrls, setSignedUrls] = useState<any>([])
  const { session } = useSession();
    
  useEffect(() => { 
    getAllImageURLs()
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

  const getAllImageURLs = async() => {
    if(session.appId) {
      const data = await getAllImages(session.appId);
      const urls = data.data.map((item: any) => item.url)
      
      const signedUrlsArray = await getImageAsUrls(urls);
      setSignedUrls(signedUrlsArray)
    }
  }

  return (
    <SafeAreaView className='h-full w-full'>
      <View className='h-full justify-between items-center'>
        <View className='h-full w-full justify-around items-center flex-row'>
          <View>
            <TouchableOpacity
              onPress={goToScanQrCode}
              className='w-12 h-12 items-center justify-center'
            >
              <Image 
                source={icons.shutter}
                className='!w-20 !h-14'
                resizeMode='contain'
              />
              <Text className='text-md text-center'>Share</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={goToGenerateQrCode}
              className='w-12 h-12 items-center justify-center'
            >
              <Image 
                source={icons.qr_code}
                className='!w-20 !h-14'
                resizeMode='contain'
              />
              <Text className='text-md text-center'>Receive</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={goToImages}
              className='w-12 h-12 items-center justify-center'
            >
              <Image 
                source={icons.gallery}
                className='!w-20 !h-14'
                resizeMode='contain'
              />
              <Text className='text-md text-center'>Images</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
