import {View, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Image from '../../ui/Image';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {ScreenNames} from '../../utils/screenConfig';
import {Clipboard} from 'react-native';
import {IMessages} from '../../types/Message';
import {IUser} from '../../types/user';

export default function ChatBubble({
  item,
  index,
  messages,
  handleChangeInReplyMessage,
  currentUser,
  chatUser,
  docid,
  handleShowMessageBox,
}: {
  handleChangeInReplyMessage: (props: IMessages) => void;
  item: IMessages;
  chatUser: IUser;
  index: number;
  messages: IMessages[];
  repliedMessage: IMessages;
  handleShowMessageBox: (props: boolean) => void;
  currentUser: IUser;
  docid: string;
}) {
  const navigation = useNavigation();
  let swipeRef = useRef<Swipeable | null>(null);

  const updateReadMessage = useCallback(() => {
    if (!item?.readBy?.includes(currentUser.uid)) {
      firestore()
        .collection('chatRoom')
        .doc(docid)
        .collection('messages')
        .doc(item?.id)
        .update({
          readBy: firestore.FieldValue.arrayUnion(currentUser?.uid),
        });
    }
  }, [currentUser.uid, docid, item?.id, item?.readBy]);

  const selectedMessage = () => {
    handleShowMessageBox(true);
    handleChangeInReplyMessage(item);
    swipeRef?.current?.close();
  };

  const IS_CURRENT_USER = currentUser?.uid === item?.sentBy;

  const handleTextCopy = useCallback(() => {
    Clipboard.setString(item?.text);
    ToastAndroid.show('Copied to Clipboard', ToastAndroid.LONG);
  }, [item?.text]);

  const handleImageViewNavigation = useCallback(() => {
    return navigation.navigate(ScreenNames?.imageView, {
      image: item?.image,
    });
  }, [item?.image, navigation]);

  useEffect(() => {
    updateReadMessage();
  }, [updateReadMessage]);

  const renderActions = () => {
    return (
      <View className="mt-7">
        <MaterialCommunityIcons name="reply" size={24} color="white" />
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        rightThreshold={20}
        renderRightActions={renderActions}
        onSwipeableOpen={selectedMessage}
        friction={2}
        ref={swipeRef}>
        {item?.repliedMessage !== null && (
          <View
            className={
              IS_CURRENT_USER
                ? 'bg-transparent border-r-[3px] max-w-[256px]  border-solid border-r-chatBubbleBg self-end mr-3 items-center px-4 rounded mt-4'
                : 'border-l-[3px] max-w-[256px]  border-solid border-l-chatBubbleBg rounded self-start ml-14 items-center px-4 mt-4'
            }>
            <Text
              className={
                IS_CURRENT_USER
                  ? 'self-end font-sans text-sm'
                  : 'self-start font-sans text-sm'
              }>
              Replied by{' '}
              {item?.sentBy === currentUser?.uid ? 'You' : chatUser?.userName}
            </Text>
            <Text
              ellipsizeMode="tail"
              className={
                IS_CURRENT_USER
                  ? 'self-end max-w-[256px] font-sans-bold text-sm mt-1 mb-1 text-white border-solid'
                  : 'self-start  max-w-[228px] font-sans-bold text-sm  mt-2 text-white"'
              }>
              {item?.repliedMessage?.text}
            </Text>
          </View>
        )}
        <TouchableOpacity
          activeOpacity={2}
          onLongPress={handleTextCopy}
          className="mx-2">
          <View
            className={
              IS_CURRENT_USER
                ? 'self-end max-w-[278px] '
                : 'self-start overflow-hidden'
            }>
            <View
              className={
                IS_CURRENT_USER
                  ? 'bg-[#171918] overflow-hidden self-end p-1 mt-[8px] max-w-[400px]  rounded-[18px]'
                  : 'bg-primary border-[0.4px] ml-12 max-w-[256px]  border-solid border-chatBubbleBg self-start overflow-hidden rounded-[18px] p-1 mt-[4px]'
              }>
              {item?.image !== '' && (
                <TouchableOpacity onPress={handleImageViewNavigation}>
                  <Image
                    resizeMode="cover"
                    source={{uri: item?.image}}
                    className="w-[278px] rounded-[28px] h-[164px]"
                  />
                </TouchableOpacity>
              )}
              {item?.text && (
                <Text className="text-white text-[16px] px-2 pt-2 font-sans">
                  {item.text}
                </Text>
              )}
              <View className="self-end flex-row flex item-center">
                <View className="self-end mr-2 mb-1 mt-1">
                  {IS_CURRENT_USER && item?.readBy?.includes(item?.sentTo) && (
                    <Ionicons
                      name="checkmark-done-sharp"
                      size={12}
                      color="white"
                    />
                  )}
                </View>
              </View>
            </View>
            {!IS_CURRENT_USER &&
              item?.sentBy !== messages[index - 1]?.sentBy && (
                <Image
                  className="h-10 absolute top-5 w-10 rounded-full"
                  source={{uri: chatUser?.userImg}}
                />
              )}
            {IS_CURRENT_USER &&
              moment(item?.createdAt).calendar() !==
                moment(messages[index - 1]?.createdAt).calendar() && (
                <Text className="text-[8px] mt-1 text-right mr-1 text-white font-sans">
                  {moment(item?.createdAt).calendar()}
                </Text>
              )}
            {!IS_CURRENT_USER &&
              item?.sentBy !== messages[index - 1]?.sentBy && (
                <Text className="text-white  font-sans-bold mt-1 ml-14">
                  {chatUser?.userName}
                </Text>
              )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
