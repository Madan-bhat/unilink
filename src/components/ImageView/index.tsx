import {View, TouchableOpacity, ToastAndroid} from 'react-native';
import React from 'react';
import Image from '../../ui/Image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useRoute} from '@react-navigation/native';
import {Portal} from 'react-native-paper';
import Modal from '../../ui/Modal';
import RNFetchBlob from 'rn-fetch-blob';

export default function ImageView({image, visible, handleClose}: any) {
  const localFilePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${Date.now()}.png`;

  const downloadBase64Image = () => {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs
        .writeFile(localFilePath, image, 'base64')
        .then(() => {
          resolve(localFilePath);
        })
        .then(() => {
          ToastAndroid.show('Image Saved in Downloads', ToastAndroid.LONG);
        })
        .catch(error => {
          console.error('Error downloading image:', error);
          reject(error);
        });
    });
  };

  return (
    <Portal>
      <Modal onDismiss={handleClose} className="bg-white" visible={visible}>
        <View className="flex-row justify-between mt-24 mx-2">
          <TouchableOpacity onPress={handleClose}>
            <AntDesign name="close" color="black" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={downloadBase64Image}>
            <AntDesign
              onPress={downloadBase64Image}
              name="download"
              color="black"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={{uri: 'data:image/png;base64,' + image}}
          resizeMode="contain"
          className="h-full w-full"
        />
      </Modal>
    </Portal>
  );
}
