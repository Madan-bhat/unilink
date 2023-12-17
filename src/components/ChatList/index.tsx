import {View, Text, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import React, {useCallback, useEffect, useState} from 'react';
import Image from '../../ui/Image';
import {useNavigation} from '@react-navigation/native';
import {ScreenNames} from '../../utils/screenConfig';
import {user as currentUser} from '../../utils/user';

export default function ChatList({item}: any) {
  const [users, setUser] = useState<any>();
  const [unreadMessages, setUnreadMessages] = useState<any>();
  const [latestMessage, setLatestMessage] = useState<any>('');
  const navigation = useNavigation();

  const docid =
    item > currentUser?.uid
      ? currentUser?.uid + '-' + item
      : item + '-' + currentUser?.uid;

  const getUnreadMessage = useCallback(() => {
    try {
      firestore()
        .collection('chatRoom')
        .doc(docid)
        .collection('messages')
        .onSnapshot(querySnapshot => {
          let unreadMessageCount = 0;

          querySnapshot.forEach(doc => {
            const readBy = doc.data()?.readBy || [];
            if (!readBy.includes(currentUser?.uid)) {
              unreadMessageCount++;
            }
          });
          setUnreadMessages(unreadMessageCount);
        });
    } catch (error) {}
  }, [docid]);

  const getLatestMessage = useCallback(async () => {
    try {
      const querySnapshot = await firestore()
        .collection('chatRoom')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(1);

      querySnapshot.onSnapshot(data => {
        data?.forEach(doc => {
          const _latestMessage = doc.data();
          setLatestMessage(_latestMessage);
        });
      });
    } catch (error) {}
  }, [docid]);

  const getUserDetail = useCallback(() => {
    firestore()
      .collection('users')
      .doc(item)
      .onSnapshot((data: any) => {
        return setUser(data?.data());
      });
  }, [item]);

  const handlechatscreenNavigation = useCallback(() => {
    return navigation.navigate(ScreenNames.chat, {
      user: {
        uid: item,
      },
    });
  }, [navigation, item]);

  useEffect(() => {
    getUserDetail();
    getLatestMessage();
    getUnreadMessage();
  }, [getLatestMessage, getUnreadMessage, getUserDetail, unreadMessages]);

  return (
    <TouchableOpacity
      onPress={handlechatscreenNavigation}
      className="bg-white-900 mt-2 p-2 justify-between rounded-md my-2 w-full">
      <View className="flex-row items-center justify-between">
        <View className="items-center flex-row">
          <View>
            {users?.status === 'online' && (
              <View className=" bg-green-500 border-white border-2 rounded-full z-10 absolute bottom-1 right-1 h-4 w-4" />
            )}
            <Image
              source={{
                uri: users?.userImg
                  ? users?.userImg
                  : 'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
              }}
              className="h-12 rounded-full w-12"
            />
          </View>
          <View className="ml-3">
            <Text className="text-white text-lg font-sans">
              {users?.userName}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-white font-sans max-w-[240px]">
              {latestMessage?.text || 'No Description'}
            </Text>
          </View>
        </View>
        {unreadMessages > 0 && (
          <View className="bg-slate-900 h-[24px] w-[24px] justify-center items-center rounded-full">
            <Text className="text-white font-sans-bold">
              {unreadMessages > 0 && unreadMessages}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
