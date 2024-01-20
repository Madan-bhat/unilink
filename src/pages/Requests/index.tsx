/// <reference types="nativewind/types" />
import {Dimensions, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Text from '../../ui/Text';
import {FlashList} from '@shopify/flash-list';
import firestore from '@react-native-firebase/firestore';
import {user} from '../../utils/user';
import RequestLists from '../../components/RequestLists';
import {useSelector} from 'react-redux';
import {IUser} from '../../types/user';
import useChatUser from '../../hooks/useUser';

export default function Requests() {
  interface istate {
    user: {
      currentUser: IUser;
    };
  }
  let currentUser = useSelector((state: istate) => state?.user?.currentUser);
  let userReq = useChatUser({uid: currentUser?.uid})?.requests;
  console.log(userReq);

  return (
    <View className="bg-primary pb-24 flex-1 p-4">
      <View className="flex justify-between ">
        <Text className=" font-sans-bold text-white mt-4 text-4xl">
          Requests
        </Text>
        <View className="h-full pb-48 mt-5 w-full">
          <FlashList
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View
                style={{height: Dimensions.get('window').height / 1.2}}
                className="justify-center flex-1 items-center">
                <Text className="text-xl text-white font-sans-bold">
                  No Requests Available
                </Text>
              </View>
            }
            className="flex flex-1 "
            estimatedItemSize={200}
            data={userReq}
            renderItem={({item}) => <RequestLists item={item} />}
          />
        </View>
      </View>
    </View>
  );
}
