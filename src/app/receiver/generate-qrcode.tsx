import { Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeGenerator from '@/components/receiver/QrCodeGenerator';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { supabase } from "@/lib/supabase";
import AlertModal from '@components/common/AlertModal';
import { router, useFocusEffect } from 'expo-router';
import { getImageAsBlob, getImageAsUrl } from '@/api/images';

type ImageSrcType = {
  uri: string
}

export default function HomeScreen() {
  const { session, startSession, isInitialized } = useSession();
  const [isSessionStarted, setIsSessionStarted] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSrcType>();

  useEffect(() => {
    setSession();

    // Cleanup: revoke the object URL when the component unmounts
    return () => {
      imageCleanup()
    };
  }, [])

  const setSession = async() => {
    setIsSessionStarted(false)
    const result = await startSession();
    console.log("setSession",result);
    
    if (result) {
      setIsSessionStarted(true)
      listenForImages();
    } else {
      setShowAlertModal(true);
    }
  }

  const listenForImages = () => {
    console.log('listening', session);
    
    const images = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'images',
          filter: `sessions_id=eq.${session.sessionDBId}`
        },
        (payload) => {
          console.log('Change received!', payload)
          displayImage(payload.new.url)
        }
      )
      .subscribe()
  }

  const imageCleanup = () => {
    if (imageSource && imageSource.uri) {
      URL.revokeObjectURL(imageSource.uri);
    }
  }

  const displayImage = async (url: string) => {
    imageCleanup()
    try {
    const imageUrl = await getImageAsUrl(url)
    
    setImageSource({uri: imageUrl})
      console.log('blob***', imageUrl);
      
    
    // Clean up object URL when done
    // URL.revokeObjectURL(imageUrl)
    } catch (error) {
      console.error('Failed to display image:', error)
    }
  }

  const downloadImage = async (url: string) => {
    imageCleanup()
    try {
    const imageBlob = await getImageAsBlob(url)
    
    // Create object URL for display
    const imageUrl = URL.createObjectURL(imageBlob)
    setImageSource({uri: imageUrl})
      console.log('blob***', imageBlob);
      
    
    // Clean up object URL when done
    // URL.revokeObjectURL(imageUrl)
  } catch (error) {
    console.error('Failed to display image:', error)
  }
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
          <Image source={imageSource} className='!w-36 !h-36' />
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
