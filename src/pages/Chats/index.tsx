import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {FlashList} from '@shopify/flash-list';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Text from '../../ui/Text';
import ChatList from '../../components/ChatList';

import {ScreenNames} from '../../utils/screenConfig';
import {user} from '../../utils/user';
import {useBackHandler} from '../../hooks/useBackHandler';

export default function Chats() {
  const [userChats, setUserChats] = useState([]);
  const navigation = useNavigation();
  useBackHandler();

  useEffect(() => {
    const fetchAndSaveChats = async () => {
      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(user?.uid)
          .get();
        const data = userDoc.data();
        if (data) {
          setUserChats(data.chats);
          await AsyncStorage.setItem('chats', JSON.stringify(data.chats));
        }
      } catch (e) {
        console.error('Error fetching and saving chats:', e);
      }
    };

    const subscribeToChatsChanges = () => {
      const userRef = firestore().collection('users').doc(user?.uid);
      const unsubscribe = userRef.onSnapshot(doc => {
        const data = doc.data();
        if (data) {
          setUserChats(data.chats);
          AsyncStorage.setItem('chats', JSON.stringify(data.chats));
        }
      });
      return unsubscribe;
    };

    const initializeChats = async () => {
      try {
        const localChats = await AsyncStorage.getItem('chats');
        if (localChats) {
          setUserChats(JSON.parse(localChats));
        } else {
          fetchAndSaveChats();
        }
      } catch (e) {
        console.error('Error initializing chats:', e);
      }
    };

    initializeChats();
    const unsubscribe = subscribeToChatsChanges();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSearchPageNavigation = () => {
    navigation.navigate(ScreenNames.search);
  };

  return (
    <View className="bg-slate-900 flex-1">
      <View className="flex-row justify-between p-4 items-center">
        <Text className="mt-2 text-white font-sans-bold text-4xl">
          Messages
        </Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleSearchPageNavigation}
            className="mr-4">
            <AntDesign name="search1" size={24} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-full p-4 bg-white rounded-t-3xl w-full mt-4">
        <FlashList
          ListEmptyComponent={
            <View
              style={{height: Dimensions.get('window').height / 1.2}}
              className=" h-full justify-center items-center flex-1">
              <Text className="font-sans-bold text-lg max-w-xs text-center">
                Start Chatting now by pressing + icon
              </Text>
            </View>
          }
          className="rounded-t-3xl"
          data={userChats}
          renderItem={({item}) => <ChatList item={item} />}
        />
      </View>
    </View>
  );
}
