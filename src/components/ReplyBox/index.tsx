import {View, Text} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {IMessages} from '../../types/Message';
import {IUser} from '../../types/user';

export default function ReplyBox({
  message,
  currentUser,
  chatUser,
  closeBox,
}: {
  message: IMessages;
  currentUser: IUser;
  chatUser: IUser;
  closeBox: () => void;
}) {
  return (
    <View className="bg-transparent absolute bottom-[58px] p-2 py-2 mb-2 w-full">
      <View className="flex-row justify-between">
        <View>
          <Text className="font-sans ml-4">
            {message?.sentBy === currentUser?.uid
              ? 'Replied To Yourself'
              : `Replied to ${chatUser?.userName}`}
          </Text>
          <Text
            numberOfLines={1}
            className="text-white max-w-xs text-md ml-4 font-sans z-10">
            {message?.text}
          </Text>
        </View>
        <AntDesign name="close" onPress={closeBox} size={24} color={'white'} />
      </View>
    </View>
  );
}
