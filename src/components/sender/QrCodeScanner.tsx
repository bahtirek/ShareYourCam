import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { CameraView, Camera, CameraMode, CameraType, } from 'expo-camera';
import IconButton from '@components/common/IconButton';
import icons from '@/constants/Icons';

const QRCodeScanner = ({onScan}: any) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [mode, setMode] = useState<CameraMode>("picture");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    onScan(data)
  };

  const scanAgain = () => {
    setScanned(false)
  }

  if (hasPermission === null) {
    return (
      <View className='w-full h-full justify-center items-center flex-1'>
        <Text>Requesting camera permission...</Text>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
      <View className='w-full h-full justify-center items-center flex-1'>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View className='w-full h-full justify-center items-center flex-1'>
      <CameraView
        style={styles.camera}
        facing={facing}
        mode={mode}
        enableTorch={torchOn}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View className='w-full h-full justify-center items-center flex-1 bg-black/30'>       
          <Text className='text-md text-center text-white -m-8'>Connect to receiver</Text>
          <View className='border-white w-64 h-64 border-2 mt-12' />
          <View className='mt-12 flex-row'>
            {scanned && (
              <View className='ml-12'>
                <IconButton icon={icons.qr_reload} handlePress={scanAgain} className='border border-primary bg-white rounded-lg' />
              </View>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
  },
});

export default QRCodeScanner;