// screens/SenderScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { CameraView, CameraCapturedPicture, Camera, CameraMode, CameraType, } from 'expo-camera';
import { useSession } from '@/providers/SessionProvider';
import { sendImageToReceiver } from '@/services/ImageServices';
import { insertImageData } from '@/api/images';

export default function SenderScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [receiverId, setReceiverId] = useState<string>('');
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);
  const { session, startSession } = useSession();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async (): Promise<void> => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        if(!photo) return;
        setCapturedImage(photo);
        setIsCameraVisible(false);
        sendImage(photo)
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const sendImage = async (photo: any): Promise<void> => {
    try {
      setIsSending(true);
      const result = await sendImageToReceiver(photo.uri, session.receiverSessionId!);
      
      if (result.success) {
        Alert.alert('Success', 'Image sent successfully');
        await insertImageData(session.receiverSessionId!, result.url!)
      } else {
        Alert.alert('Error', result.message || 'Failed to send image');
      }
    } catch (error) {
      console.error('Error sending image:', error);
      Alert.alert('Error', 'Failed to send image');
    } finally {
      setIsSending(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
        <View style={styles.container}>
          {
            !isSending &&
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                  <Text style={styles.text}>take</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          }
          {
            isSending &&
            <View className='h-full w-full justify-center items-center bg-white/70'>
              <ActivityIndicator size={'large'} color={"#FF4416"} />
            </View>
          }
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});