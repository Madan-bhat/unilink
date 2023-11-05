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
    <View className="bg-white flex-1 p-4">
      <View className="flex justify-between ">
        <Text className="mt-2 font-sans-bold text-slate-900 mt-4 text-4xl">
          Requests
        </Text>
        <View className="h-full w-full">
          <FlashList
            ListEmptyComponent={
              <View
                style={{height: Dimensions.get('window').height / 1.2}}
                className="justify-center flex-1 items-center">
                <Text className="text-xl text-slate-900 font-sans-bold">
                  No Requests Available
                </Text>
              </View>
            }
            className="flex flex-1 h-full"
            estimatedItemSize={200}
            data={userRequests}
            renderItem={({item}) => <RequestLists item={item} />}
          />
        </View>
      </View>
    </View>
  );
}
