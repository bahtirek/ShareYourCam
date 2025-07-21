import { Image, StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { useImage } from '@/providers/ImagesProvider';
import RadialGradientCircle from '@/components/common/RadialGradientCircle';

export default function HomeScreen() {
  const { getAllImageURLs, signedUrls } = useImage();
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
      await getAllImageURLs(session.appId);
      setTotalImages(signedUrls.length)
    }
  }

  const colorList = ['#ffffff', '#ffffff', '#ffffff', '#f0f0f0', '#f0f0f0', '#f0f0f0', '#f0f0f0', '#f0f0f0']

  return (
    <SafeAreaView className='h-full w-full justify-between items-center'>
      <View className='h-full w-full absolute items-center'>
        <RadialGradientCircle
          size={screenHeight} // Diameter of the circle
          colors={colorList} // Array of colors for the gradient
          cx={screenHeight/2} // X-coordinate of the gradient center (relative to the circle's top-left)
          cy={screenHeight/2} // Y-coordinate of the gradient center
          r={screenHeight/2} // Radius of the gradient
        />
      </View>
      <View className='h-full'>
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
          <View className='absolute bottom-[-10%] left-[38%]'>
            <TouchableOpacity
              onPress={goToImages}
              className='w-14 h-16 items-center justify-center'
            >
              <Image 
                source={icons.gallery}
                className='!w-14 !h-14'
                resizeMode='contain'
              />
              <Text className='text-sm text-center' style={styles.colorViolet}>Images</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    position: 'absolute',
    width: "100%",
    height: "100%",
  },
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