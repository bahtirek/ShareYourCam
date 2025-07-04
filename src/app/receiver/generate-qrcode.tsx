import { Image, Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeGenerator from '@/components/receiver/QrCodeGenerator';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { supabase } from "@/lib/supabase";
import AlertModal from '@components/common/AlertModal';
import { router, useFocusEffect } from 'expo-router';
import { useImage } from '@/providers/ImagesProvider';
import SavedImages from "@components/receiver/Images"

export default function HomeScreen() {
  const { session, startSession, isInitialized } = useSession();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [image, setImage] = useState('');
  const [generatingQRCode, setGeneratingQRCode] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const {saveImageWithBlobUtil, images} = useImage()

  useEffect(() => {
    setSession();
    listenForImages();
    setIsIOS(Platform.OS === 'ios')
  }, [])

  useFocusEffect(
    useCallback(() => {
      setSession()
    }, [])
  );

  const setSession = async() => {
    setShowQRCode(false)
    const result = await startSession('sharer');
    setGeneratingQRCode(false);
    
    if (result) {
      setShowQRCode(true);
    } else {
      setShowAlertModal(true);
    }
  }

  const listenForImages = () => {   
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
          downloadImage(payload)
        }
      )
      .subscribe()
  }

  const downloadImage = async (payload: any) => {
    const { data, error } = await supabase.storage
      .from('images')
      .createSignedUrl(payload.new.url, 3600)
    if (data) {
      setImage(data.signedUrl)
      //saveImageWithBlobUtil(data.signedUrl)
      setShowQRCode(false);
      setGeneratingQRCode(false);
      setShowImages(true)
    } else {
      console.log("createSignedUrl error", error)
    }
  }

  return (
    <SafeAreaView className='h-full w-full'>
      <View className='h-full justify-between items-center'>
        <View className='h-full w-full justify-center items-center'>
          {
            generatingQRCode &&
            <View className='pt-20'>
              <Text className='text-lg text-center -mb-8'>Generating QR code...</Text>
              <Image source={{uri: image}}
                className='!w-28 !h-28'
                resizeMode='cover' />
            </View>
          }
          {
            showQRCode &&
            <View>
              <View>
                <Text className='text-lg text-center -mb-8'>Connect to sharer</Text>
              </View>
              <View className='pt-10'>
                <QRCodeGenerator text={session.sessionId} />
              </View>
            </View>
          }
          {
            showImages &&
            <SavedImages images={images} />
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
