import { SignedUrlType } from '@/types';
import  * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
  
const albumName = 'ShareYourCam';

export const saveToMediaLibrary = async(url: SignedUrlType) => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    if(mediaLibraryPermission.granted) {
        try {
            const uri = await getUri(url);
            const asset = await MediaLibrary.createAssetAsync(uri);
            const album = await MediaLibrary.getAlbumAsync(albumName);
            let mediaResult;
            if(album === null) {
                mediaResult = await MediaLibrary.createAlbumAsync(albumName, asset, false)
                if(mediaResult && mediaResult.id) return {success: true}
            } else {
                mediaResult = await MediaLibrary.addAssetsToAlbumAsync([asset], album, true)
                console.log('mediaResult', mediaResult);
                
                if(mediaResult) return {success: true}
            }
            //couldn't save the media
            return {success: false, error: null}
        } catch (error) {
            console.error(error);
            return {success: false, error: error}
        }
    } else {
        return {success: false}
    }
}

export const getLastSavedImageFromAlbum = async() => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission not granted to access media library!');
    return null;
  }

  const albums = await MediaLibrary.getAlbumsAsync();
  const targetAlbum = albums.find(album => album.title === albumName);

  if (!targetAlbum) {
    console.log(`Album "${albumName}" not found.`);
    return null;
  }

  const { assets } = await MediaLibrary.getAssetsAsync({
    album: targetAlbum,
    first: 1,
    sortBy: [MediaLibrary.SortBy.creationTime],
    mediaType: [MediaLibrary.MediaType.photo], // Specify to get only photos
  });

  if (assets.length > 0) {
    return assets[0]; // This is the last saved image
  } else {
    console.log('No images found in the album.');
    return null;
  }
}

export const getUri = async(url: SignedUrlType) => {
    const {filename} = getFilenameAndSession(url.path!);
    const fileUri = FileSystem.documentDirectory + filename;
    const { uri } = await FileSystem.downloadAsync(url.signedUrl!, fileUri);    
    return uri
}

export const getFilenameAndSession = (path: string) => {
    const pathSplit = path.split('/')
    
    return {session: pathSplit[0], filename: pathSplit[1]}
}