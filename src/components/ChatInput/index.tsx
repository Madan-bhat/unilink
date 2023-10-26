import {View, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../../ui/Input';
import EmojiBoard from 'rn-emoji-keyboard';
import {TextInput} from 'react-native-paper';

interface IChatInput {
  onChange: (prop: string) => void;
  onSend: () => void;
  text: string;
  onEmojiBoardOpen: () => void;
  isEmojiBoardVisible: boolean;
  selectImage?: () => void;
  showSelectImage: boolean;
  onEmojiSelect: (emoji: any) => void;
  disabled?: boolean;
}

function ChatInput({
  onChange,
  onEmojiBoardOpen,
  isEmojiBoardVisible,
  onEmojiSelect,
  text,
  onSend,
  selectImage,
  disabled,
  showSelectImage,
}: IChatInput) {
  return (
    <KeyboardAvoidingView className="flex-row absolute bottom-2 self-end flex-[1]">
      <View className="flex-row flex-1 max-h-14">
        <View className="flex-[18] ">
          <Input
            value={text}
            clearButtonMode="always"
            onChangeText={_val => onChange(_val)}
            right={
              showSelectImage ? (
                <TextInput.Icon
                  onPress={selectImage}
                  icon={'image-outline'}
                  color={'black'}
                />
              ) : (
                <></>
              )
            }
            left={
              <TextInput.Icon
                onPress={onEmojiBoardOpen}
                icon={'sticker-emoji'}
                color={'black'}
              />
            }
            placeholder="Type Your Message Here ...."
            className=" bg-white  ml-2 shadow-slate-950 text-slate-900"
          />
        </View>
        <View className="flex-[3] justify-center items-center ">
          <TouchableOpacity
            disabled={disabled}
            onPress={onSend}
            className={
              disabled
                ? 'bg-slate-500 shadow-lg shadow-slate-500 rounded-full p-3'
                : 'bg-slate-900 shadow-lg shadow-slate-800 rounded-full p-3'
            }>
            <MaterialCommunityIcons name="send" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <EmojiBoard
        onClose={onEmojiBoardOpen}
        open={isEmojiBoardVisible}
        onEmojiSelected={onEmojiSelect}
      />
    </KeyboardAvoidingView>
  );
}

export default React.memo(ChatInput);
