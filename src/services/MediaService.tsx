import  * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
  
export const saveToMediaLibrary = async(url: string, auto: boolean = true) => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    if(mediaLibraryPermission.granted) {
    const filename = `${Date.now()}.jpg`;
        try {
            const albumName = 'ShareYourCam';
            const fileUri = FileSystem.documentDirectory + 'temp_image_file.jpg';
            const { uri } = await FileSystem.downloadAsync(url, fileUri);
            const asset = await MediaLibrary.createAssetAsync(uri);
            const album = await MediaLibrary.getAlbumAsync(albumName);
            console.log('album,', album);
            if(album === null) {
            await MediaLibrary.createAlbumAsync(albumName, asset, false)
            } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, true)
            }
            
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log('no permission', url);
    }
}