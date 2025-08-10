import { Image, StyleSheet, TouchableOpacity, Text, View, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@constants/Icons';
import QRCodeScanner from '@/components/sender/QrCodeScanner';
import React, { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { useSession } from '@/providers/SessionProvider';
import { useFocusEffect } from 'expo-router';
import AlertModal from '@components/common/AlertModal';

type LoaderType = {
    show: boolean
}

export default function Loader({show}: LoaderType) {
  return (
    <Modal
    animationType="fade"
    transparent={true}
    visible={show}
    >
    <View className='h-full w-full justify-center items-center bg-black/40 '>
    <View className=''>
        <ActivityIndicator size={'large'} color={"#FF4416"} />
    </View>
    </View>
    </Modal>
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
