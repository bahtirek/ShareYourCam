
import * as ImageManipulator from 'expo-image-manipulator';

export const createThumbnail = async (imageUri: string) => {

const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [ { resize: { height: 100 } }, ],
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG } 
  );
  return manipResult;
};