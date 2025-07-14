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

  const share = () => {
    router.navigate('/sender/scan-qrcode')
  }
  
  const receive = () => {
    router.navigate('/receiver/generate-qrcode')
  }

  const getAllImageURLs = async() => {
    if(session.appId) {
      const data = await getAllImages(session.appId);
      const urls = data.data.map((item: any) => item.url)
      
      const signedUrlsArray = await getImageAsUrls(urls);
      console.log("signedUrlsArray", signedUrlsArray);
      
      setSignedUrls(signedUrlsArray)
    }
    
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
        {
          signedUrls.map((url: any) => {
            return (
              <Image source={{uri: url.signedUrl}} className='!w-36 !h-36' key={url.path} />
            )
          })
        }
      </View>
    </SafeAreaView>
  );
}
