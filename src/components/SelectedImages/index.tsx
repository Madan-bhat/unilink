import {View, Text, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {Portal} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from '../../ui/Modal';
import Image from '../../ui/Image';
import ChatInput from '../ChatInput';

interface ISelectedImages {
  image: string;
  visible: boolean;
  text: string;
  onChange: (props: string) => void;
  onSend: () => void;
  onClose: any;
  isImageUploading: boolean;
}

export default function SelectedImages({
  image,
  visible,
  isImageUploading,
  onChange,
  text,
  onSend,
  onClose,
}: ISelectedImages) {
  return (
    <Portal>
      <Modal className="bg-black" visible={visible}>
        <TouchableOpacity
          onPress={onClose}
          className="top-4 left-4 z-20 absolute">
          <AntDesign name="close" color={'white'} size={24} />
        </TouchableOpacity>
        <View className="bg-black">
          <View className="h-full items-center justify-center w-full bg-black">
            <Image
              className="h-4/6 w-full"
              resizeMode="contain"
              source={{uri: image}}
            />
            <ChatInput
              disabled={
                image || !text?.replace(/\s/g, '').length > 0 ? false : true
              }
              image={image}
              onChange={onChange}
              onSend={onSend}
              text={text}
              isImageUploading={isImageUploading}
              showSelectImage={image ? false : true}
            />
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
