import { Image, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';
import QRCodeGenerator from '@/components/receiver/QrCodeGenerator';
import { useEffect, useState } from 'react';
import { SessionType } from '@/types';
import { useSession } from '@/providers/SessionProvider';

export default function HomeScreen() {
    //const [session, setSession] = useState<SessionType>({});
    const { session, startSession } = useSession();

  useEffect(() => {
    startSession()
    console.log(session);
  }, [])

  const share = () => {

  }
  
  const receive = () => {

  }

  return (
    <SafeAreaView className='h-full w-full'>
      <View className='h-full justify-between items-center'>
        <View className='h-full w-full justify-center items-center'>
          <View>
            <Text className='text-lg text-center -mb-8'>Connect to sharer</Text>
          </View>
          <View className='pt-10'>
            <QRCodeGenerator text={session.sessionId} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
