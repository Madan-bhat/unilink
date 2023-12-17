import {View, TouchableOpacity, ToastAndroid} from 'react-native';
import React, {useCallback} from 'react';
import Image from '../../ui/Image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation, useRoute} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

export default function ImageView({image}: any) {
  const {
    params,
  }: {
    params: {
      image: string;
    };
  } = useRoute();
  const navigation = useNavigation();
  const localFilePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${image}.png`;

  const handleBackNavigation = useCallback(() => {
    navigation.goBack();
  });

  const downloadImage = async () => {
    try {
      const downloadOptions = {
        fromUrl: params?.image,
        toFile: localFilePath,
      };

      const response = await RNFS.downloadFile(downloadOptions).promise;

      if (response.statusCode === 200) {
        ToastAndroid.show(
          'Image Saved in The Download folder',
          ToastAndroid.LONG,
        );
        console.log('Image downloaded successfully');
      } else {
        console.error('Failed to download image');
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <View className="flex-1 w-full bg-black">
      <View className="flex ">
        <View className="flex-row justify-between z-10  bg-transparent mt-24 mx-2">
          <TouchableOpacity onPress={handleBackNavigation}>
            <AntDesign name="left" color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={downloadImage}>
            <AntDesign name="download" color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <Image
        source={{uri: params?.image}}
        resizeMode="contain"
        className="h-full absolute w-full"
      />
    </View>
  );
}
