import { Image, StyleSheet, TouchableOpacity, Text, View, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';
import QRCodeScanner from '@/components/sender/QrCodeScanner';
import { useState } from 'react';
import { router } from 'expo-router';
import { useSession } from '@/providers/SessionProvider';

export default function HomeScreen() {
  const { session, startSession } = useSession();
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [showError, setShowError] = useState(false);

  const onCancel = () => {
    router.back()
  }

  const onReScan = () => {
    router.back()
  }

  const handleScan = (sessionId: string) => {
    console.log("data", sessionId);
    /* Check if session exists
    show loader
    check if exists
    hide loader
    startSession
    navigate
    */
    startSession('sharer', sessionId);
    router.navigate('/sender/camera')
  }

  return (
    <View style={styles.container}>
      <QRCodeScanner onScan={handleScan }/>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLoaderModal}
      >
        <View className='h-full w-full justify-center items-center bg-black/40 '>
        <View className=''>
          <ActivityIndicator size={'large'} color={"#FF4416"} />
        </View>
        </View>
      </Modal>
    </View>
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
