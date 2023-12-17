import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-paper';
import {View, TouchableOpacity, KeyboardAvoidingView} from 'react-native';

import Input from '../../ui/Input';
import EmojiBoard from 'rn-emoji-keyboard';
import {useActionSheet} from '@expo/react-native-action-sheet';
import ActivityIndicator from '../../ui/ActivityIndicator';
import {IMessages} from '../../types/Message';

interface IChatInput {
  onChange: (prop: string) => void;
  onSend: () => void;
  text: string;
  repliedMessage: IMessages;
  selectImage?: () => void;
  showSelectImage: boolean;
  openCamera: () => void;
  openLibrary: () => void;
  disabled?: boolean;
  isImageUploading: boolean;
  image: string;
}

function ChatInput({
  onChange,
  text,
  openCamera,
  openLibrary,
  image,
  onSend,
  isImageUploading,
  disabled,
  showSelectImage,
}: IChatInput) {
  const {showActionSheetWithOptions} = useActionSheet();
  const onPress = () => {
    const options = ['Open Camera', 'Choose From Library', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex: any) => {
        switch (selectedIndex) {
          case 0:
            openCamera();
            break;
          case 1:
            openLibrary();
            break;
          case cancelButtonIndex:
          // Canceled
        }
      },
    );
  };

  const _disabled = !image && (!text || !text.trim());
  return (
    <KeyboardAvoidingView className="flex-row bg-transparent absolute border-white rounded-full border-[0.3px] border-solid bottom-2 mx-2 self-center flex-[1]">
      <View className="flex-row flex-1 max-h-14">
        <View className="flex-[18] ">
          <Input
            multiline
            numberOfLines={4}
            value={text}
            clearButtonMode="always"
            cursorColor={'white'}
            onChangeText={_val => onChange(_val)}
            left={
              showSelectImage && (
                <TextInput.Icon
                  onPress={onPress}
                  icon={'image-outline'}
                  color={'white'}
                />
              )
            }
            textColor={'white'}
            placeholder="Type Your Message Here ...."
            className=" bg-transparent text-white shadow-slate-950 "
          />
        </View>
        <View className="flex-[3] justify-center items-center ">
          <TouchableOpacity
            disabled={disabled ? disabled : _disabled}
            onPress={onSend}
            className={
              disabled
                ? 'bg-slate-500 shadow-lg shadow-slate-500 rounded-full p-3'
                : 'bg-primary shadow-lg shadow-slate-800 rounded-full p-3'
            }>
            {isImageUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <MaterialCommunityIcons name="send" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default React.memo(ChatInput);
