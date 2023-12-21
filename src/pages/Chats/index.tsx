import React, {useCallback, useEffect, useMemo, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {FlashList} from '@shopify/flash-list';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Text from '../../ui/Text';
import ChatList from '../../components/ChatList';

import {ScreenNames} from '../../utils/screenConfig';
import {user} from '../../utils/user';
import {useBackHandler} from '../../hooks/useBackHandler';
import VerificationBanner from '../../components/VerificationBanner';
import {IMessages} from '../../types/Message';

export default function Chats() {
  const [userchats, setUserchats] = useState([]);
  const [refreshing, setRefresh] = useState(false);
  const navigation = useNavigation();
  useBackHandler();

  const getChats = useCallback(() => {
    setRefresh(!refreshing);
    const userRef = firestore().collection('users').doc(user?.uid);
    userRef.onSnapshot(doc => {
      const data = doc.data();
      setUserchats(data?.chats);
      if (data) {
        setUserchats(data.chats);
        setRefresh(false);
      }
    });
  }, [refreshing]);

  useEffect(() => {
    getChats();
  }, []);

  const handleSearchPageNavigation = () => {
    navigation.navigate(ScreenNames.search);
  };

  const renderItem = useCallback(({item}: any) => {
    return <ChatList item={item} />;
  }, []);

  return (
    <View className="bg-black flex-1">
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
      <View className="h-full overflow-hidden  p-4 pb-[186px] bg-primary rounded-t-3xl w-full mt-4">
        {auth().currentUser?.emailVerified === false && <VerificationBanner />}
        <View className="h-full w-full">
          <FlashList
            // keyExtractor={({item}: {item: IMessages}) => item?.text?.toString()}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={getChats}
            estimatedItemSize={200}
            ListEmptyComponent={
              <View
                style={{height: Dimensions.get('window').height / 1.2}}
                className=" h-full justify-center items-center flex-1">
                <Text className="font-sans-bold text-lg max-w-xs text-center">
                  Start Chatting now by pressing + icon
                </Text>
              </View>
            }
            data={userchats}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
}
