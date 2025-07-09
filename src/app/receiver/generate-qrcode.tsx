import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeGenerator from '@/components/receiver/QrCodeGenerator';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { supabase } from "@/lib/supabase";
import AlertModal from '@components/common/AlertModal';
import { router, useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const { session, startSession, isInitialized } = useSession();
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    setSession();
  }, [])

  const setSession = async() => {
    setIsSessionStarted(false)
    const result = await startSession('receiver');
    
    if (result) {
      setIsSessionStarted(true)
      listenForImages();
    } else {
      setShowAlertModal(true);
    }
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
      <AlertModal
        title='Sorry!'
        text='Something went wrong. Please try later.'
        showModal={showAlertModal}
        actions={
          [
            {label: 'Ok', style: 'text-primary',onPress:() => { router.push('/'), setShowAlertModal(false) }}
          ]
        }
      ></AlertModal>
    </SafeAreaView>
  );
}
