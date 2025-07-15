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

  const getAllImageURLs = async() => {
    if(session.appId) {
      const data = await getAllImages(session.appId);
      const urls = data.data.map((item: any) => item.url)
      
      const signedUrlsArray = await getImageAsUrls(urls);
      setSignedUrls(signedUrlsArray)
    }
  }

  return (
    <SafeAreaView className='w-full'>
      <View className='flex-row gap-3 py-20 px-8 flex-wrap w-[356px] mx-auto'>
        {
          signedUrls.map((url: any) => {
            return (
              <View >
                <Image source={{uri: url.signedUrl}} className='!w-16 !h-16 aspect-square rounded' key={url.path} />
              </View>
            )
          })
        }
      </View>
    </SafeAreaView>
  );
}
