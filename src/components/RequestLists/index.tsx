import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Image from '../../ui/Image';
import useChatUser from '../../hooks/useUser';
import {useSelector} from 'react-redux';

export default function RequestLists({item}: any) {
  const user = useSelector(state => state.user.currentUser);
  const users = useChatUser({uid: item});

  const reject = useCallback(() => {
    try {
      firestore()
        .collection('users')
        .doc(user?.uid)
        .update({
          requests: firestore.FieldValue.arrayRemove(item),
        })
        .then(() => {
          firestore()
            .collection('users')
            .doc(item)
            .update({
              requested: firestore.FieldValue.arrayRemove(user?.uid),
            });
        });
    } catch (error) {}
  }, [item]);

  const accept = useCallback(async () => {
    try {
      await Promise.all([
        firestore()
          .collection('users')
          .doc(user?.uid)
          .update({
            requests: firestore.FieldValue.arrayRemove(item),
            chats: firestore.FieldValue.arrayUnion(item),
          }),
        firestore()
          .collection('users')
          .doc(item)
          .update({
            requested: firestore.FieldValue.arrayRemove(user?.uid),
            chats: firestore.FieldValue.arrayUnion(user?.uid),
          }),
      ]);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  }, [item]);

  return (
    <View className=" p-2 rounded-md bg-primary mt-2 w-full">
      <View className="flex-row items-center justify-between">
        <View className="items-center flex-row">
          <Image
            source={{
              uri: users?.userImg
                ? users?.userImg
                : 'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
            }}
            className="h-12 rounded-full w-12"
          />
          <View className="ml-3">
            <Text className="text-white text-lg font-sans">
              {users?.userName}
            </Text>
            <Text>{users?.description || 'No Description'}</Text>
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity onPress={reject} className="mr-3">
            <AntDesign name="close" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={accept}>
            <AntDesign name="check" size={24} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
