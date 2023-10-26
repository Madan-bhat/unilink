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
  isEmojiBoardVisible: boolean;
  onEmojiSelect: (prop: any) => any;
  onEmojiBoardOpen: () => void;
  onClose: any;
}

export default function SelectedImages({
  image,
  visible,
  onChange,
  text,
  onSend,
  isEmojiBoardVisible,
  onEmojiSelect,
  onEmojiBoardOpen,
  onClose,
}: ISelectedImages) {
  return (
    <Portal>
      <Modal visible={visible}>
        <TouchableOpacity
          onPress={onClose}
          className="bg-slate-500 shadow-slate-950 shadow-2xl absolute z-30 top-2 p-4 rounded-full right-2">
          <AntDesign name="close" color={'white'} size={24} />
        </TouchableOpacity>
        <View className="h-full items-center justify-center w-full bg-white">
          <Image
            className="h-4/6 w-full"
            resizeMode="contain"
            source={{uri: 'data:image/png;base64,' + image}}
          />
          <ChatInput
            onChange={onChange}
            onSend={onSend}
            text={text}
            onEmojiBoardOpen={onEmojiBoardOpen}
            isEmojiBoardVisible={isEmojiBoardVisible}
            onEmojiSelect={onEmojiSelect}
            showSelectImage={false}
          />
        </View>
      </Modal>
    </Portal>
  );
}