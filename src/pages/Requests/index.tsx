/// <reference types="nativewind/types" />
import {Dimensions, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Text from '../../ui/Text';
import {FlashList} from '@shopify/flash-list';
import firestore from '@react-native-firebase/firestore';
import {user} from '../../utils/user';
import RequestLists from '../../components/RequestLists';

export default function Requests() {
  let [userRequests, setRequests] = useState([]);

  const getRequests = useCallback(() => {
    try {
      firestore()
        .collection('users')
        .doc(user?.uid)
        .onSnapshot(data => {
          let userData = data.data();
          setRequests(userData?.requests);
        });
    } catch (e) {}
  }, []);

  useEffect(() => {
    getRequests();
  }, [getRequests]);

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
            data={userRequests}
            renderItem={({item}) => <RequestLists item={item} />}
          />
        </View>
      </View>
    </View>
  );
}
