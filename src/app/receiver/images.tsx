import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImage } from '@/providers/ImagesProvider';

export default function HomeScreen() {
  const { signedThumbnailUrls } = useImage();

  return (
    <SafeAreaView className='w-full'>
      <View className='flex-row gap-3 py-20 px-8 flex-wrap w-[356px] mx-auto'>
        {
          signedThumbnailUrls.map((url: any, index) => {
            return (
              <View >
                <Image source={{uri: url.signedUrl}} className='!w-16 !h-16 aspect-square rounded' key={index} />
              </View>
            )
          })
        }
      </View>
    </SafeAreaView>
  );
}
