import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeGenerator from '@/components/receiver/QrCodeGenerator';
import { useContext, useEffect, useState} from 'react';
import { useSession } from '@/providers/SessionProvider';
import { supabase } from "@/lib/supabase";
import { ImageContext } from '@/providers/ImagesProvider';

export default function HomeScreen() {
  //const { session, startSession } = useContext(ImageContext)
  const { session, startSession, isInitialized } = useSession();
  const [isSessionStarted, setIsSessionStarted] = useState(false)

  useEffect(() => {
    newSession();
    listenForImages();
  }, [])

  const newSession = async () => {
    await startSession('receiver');
    console.log("session 21", session.sessionId);
    
    setIsSessionStarted(true)
  }

  const listenForImages = () => {
    console.log('listening');
    
    const images = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'images'
        },
        (payload) => {
          console.log('Change received!', payload)
          
        }
      )
      .subscribe()

  }

  return (
    <SafeAreaView className='h-full w-full'>
      <View className='h-full justify-between items-center'>
        <View className='h-full w-full justify-center items-center'>
          {
            !isSessionStarted &&
            <View className='pt-20'>
              <Text className='text-lg text-center -mb-8'>Generating QR code...</Text>
            </View>
          }
          {
            isSessionStarted &&
            <View>
              <View>
                <Text className='text-lg text-center -mb-8'>Connect to sharer</Text>
              </View>
              <View className='pt-10'>
                <QRCodeGenerator text={session.sessionId} />
              </View>
            </View>
          }
        </View>
      </View>
    </SafeAreaView>
  );
}
