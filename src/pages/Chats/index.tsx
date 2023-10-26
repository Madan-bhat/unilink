import React, {useCallback, useEffect, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Text from '../../ui/Text';
import ChatList from '../../components/ChatList';

import {ScreenNames} from '../../utils/screenConfig';
import {user} from '../../utils/user';
import {useBackHandler} from '../../hooks/useBackHandler';

export default function Chats() {
  const [userChats, setChats] = useState([]);
  const navigation = useNavigation();
  useBackHandler();

  const fetchAndSaveChats = useCallback(async () => {
    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(user?.uid)
        .get();
      const data = userDoc.data();
      if (data) {
        setChats(data.chats);
        await AsyncStorage.setItem('chats', JSON.stringify(data.chats));
      }
    } catch (e) {
      console.error('Error fetching and saving chats:', e);
    }
  }, []);

  const subscribeToChatsChanges = useCallback(() => {
    const userRef = firestore().collection('users').doc(user?.uid);
    const unsubscribe = userRef.onSnapshot(doc => {
      const data = doc.data();
      if (data) {
        setChats(data.chats);

        // Update local storage with the new data
        AsyncStorage.setItem('chats', JSON.stringify(data.chats));
      }
    });

    // Return the unsubscribe function to stop listening when needed
    return unsubscribe;
  }, []);

  const initializeChats = useCallback(async () => {
    try {
      const localChats = await AsyncStorage.getItem('chats');
      if (localChats) {
        setChats(JSON.parse(localChats));
      } else {
        fetchAndSaveChats();
      }
    } catch (e) {
      console.error('Error initializing chats:', e);
    }
  }, [fetchAndSaveChats]);

  const handleSearchPageNavigation = useCallback(() => {
    navigation.navigate(ScreenNames.search);
  }, [navigation]);

  useEffect(() => {
    initializeChats();
    const unsubscribe = subscribeToChatsChanges();
    return () => {
      unsubscribe();
    };
  }, [initializeChats, subscribeToChatsChanges]);

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
          className="rounded-t-3xl"
          data={userChats}
          renderItem={({item}) => <ChatList item={item} />}
        />
      </View>
    </View>
  );
}
