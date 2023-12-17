// ImagePickerUtils.js
import ImageCropPicker from 'react-native-image-crop-picker';
import {imagePickerProps} from './imageFiles';

export const takePhotoFromCamera = (
  setImage: (arg0: string) => void,
  handleToggleSelectedImageModal: () => void,
) => {
  ImageCropPicker.openCamera({
    ...imagePickerProps,
  }).then(_image => {
    setImage(`${_image.path}`);
    handleToggleSelectedImageModal();
  });
};

export const choosePhotoFromLibrary = (
  setImage: (arg0: string) => void,
  handleToggleSelectedImageModal: () => void,
) => {
  ImageCropPicker.openPicker({
    ...imagePickerProps,
  }).then(_image => {
    setImage(`${_image.path}`);
    handleToggleSelectedImageModal();
  });
};
