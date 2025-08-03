import { Image, StyleSheet, TouchableOpacity, Text, View, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';
import QRCodeScanner from '@/components/sender/QrCodeScanner';
import React, { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { useSession } from '@/providers/SessionProvider';
import { useFocusEffect } from 'expo-router';
import AlertModal from '@components/common/AlertModal';
import Loader from '@/components/common/Loader';

export default function HomeScreen() {
  const { session, startSession, setReceiverSessionId } = useSession();
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    
  }, [])

  const handleScan = async (sessionId: string) => {
    console.log("data", sessionId);
    if(sessionId) setReceiverSessionId(sessionId)
    /* Check if session based on sessionId exists
    show loader
    check if exists
    hide loader
    startSession
    navigate
    */
    router.navigate('/sender/camera')
  }

  return (
    <SafeAreaView edges={["left", "right"]} className='h-full bg-white'>
      <QRCodeScanner onScan={handleScan }/>
      <Loader show={showLoaderModal} />
      <AlertModal
        title='Sorry!'
        text='Something went wrong. Please try later.'
        showModal={showAlertModal}
        actions={
          [
            {label: 'Ok', style: 'text-primary' ,onPress:() => { router.push('/'), setShowAlertModal(false) }}
          ]
        }
      ></AlertModal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
})
