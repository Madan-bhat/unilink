import React, {useCallback, useEffect, useMemo, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {FlashList} from '@shopify/flash-list';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Text from '../../ui/Text';
import ChatList from '../../components/ChatList';
import VerificationBanner from '../../components/VerificationBanner';

import {ScreenNames} from '../../utils/screenConfig';
import {useBackHandler} from '../../hooks/useBackHandler';
import {useSelector} from 'react-redux';

export default function Chats() {
  const currentUser = useSelector((state: any) => state.user?.currentUser);
  const [refreshing] = useState(false);
  const navigation = useNavigation();

  useBackHandler();

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
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
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
            data={currentUser?.chats}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
}
