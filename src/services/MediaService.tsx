import  * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
  
export const saveToMediaLibrary = async(url: string) => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    if(mediaLibraryPermission.granted) {
        try {
            const albumName = 'ShareYourCam';
            const uri = await getUri(url);
            const asset = await MediaLibrary.createAssetAsync(uri);
            const album = await MediaLibrary.getAlbumAsync(albumName);
            let mediaResult;
            if(album === null) {
                mediaResult = await MediaLibrary.createAlbumAsync(albumName, asset, false)
                if(mediaResult && mediaResult.id) return {success: true}
            } else {
                mediaResult = await MediaLibrary.addAssetsToAlbumAsync([asset], album, true)
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

export const getUri = async(url: string) => {
    const filename = `${Date.now()}.jpg`;
    const fileUri = FileSystem.documentDirectory + filename;
    const { uri } = await FileSystem.downloadAsync(url, fileUri);    
    return uri
}