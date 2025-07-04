import { Image, Text, View,PermissionsAndroid, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeGenerator from '@/components/receiver/QrCodeGenerator';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { supabase } from "@/lib/supabase";
import AlertModal from '@components/common/AlertModal';
import { router, useFocusEffect } from 'expo-router';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useImage } from '@/providers/ImagesProvider';
import SavedImages from "@components/receiver/Images"
//import * as FileSystem from 'expo-file-system';
import { File, Paths, Directory } from 'expo-file-system/next';


export default function HomeScreen() {
  const { session, startSession, isInitialized } = useSession();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [image, setImage] = useState('');
  const [generatingQRCode, setGeneratingQRCode] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [showImages, setShowImages] = useState(false);
  //const {saveImageWithBlobUtil, images} = useImage()

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
      saveImageWithBlobUtil(data.signedUrl)
      //setShowQRCode(false);
      //setGeneratingQRCode(false);
      //setShowImages(true)
    } else {
      console.log("createSignedUrl error", error)
    }
  }

    const [savedImagePath, setSavedImagePath] = useState('');
    const [images, setImages] = useState<string[]>([])
  
    const saveImageWithBlobUtil = async (imageUrl: string) => {
      const filename = `share_your_cam_${Date.now()}.jpg`;
      const destination = new Directory(Paths.cache, 'pdfs');
      console.log("fileName", filename);
      
      /* const result = await FileSystem.downloadAsync(
        imageUrl,
        FileSystem.documentDirectory + filename
      ); */

        // Log the download result
      //console.log(result);

      // Save the downloaded file
      //saveFile(result.uri, filename, result.headers["Content-Type"]);
      /* const filePath = RNFS.DocumentDirectoryPath + '/myFile.txt';
     const fileContent = 'Hello, this is the content of my file';
     saveFile(filePath, fileContent); */
     try {
      if(!destination.exists) {
        destination.create();
      }
      console.log(destination.list());
      
        const output = await File.downloadFileAsync(imageUrl, destination);
        console.log("output.exists", output.exists); // true
        console.log("output.uri", output.uri); // path to the downloaded file, e.g. '${cacheDirectory}/pdfs/sample.pdf'
      } catch (error) {
        console.error("download error",error);
      }
    };

    /* const saveFile = async (filePath: any, content: any) => {
       try {
         await RNFS.writeFile(filePath, content, 'utf8');
         console.log('File saved successfully');
       } catch (error) {
         console.error('Error saving file:', error);
       }
     }; */

/*   async function saveFile(uri: any, filename: string, mimetype: any) {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
      }
    }
  } */

  return (
    <SafeAreaView className='h-full w-full'>
      <View className='h-full justify-between items-center'>
        <View className='h-full w-full justify-center items-center'>
          {
            generatingQRCode &&
            <View className='pt-20'>
              <Text className='text-lg text-center -mb-8'>Generating QR code...</Text>
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
          {/* {
            showImages &&
            <SavedImages images={images} />
          } */}
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
