import {View, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Input from '../../ui/Input';
import {TextInput} from 'react-native-paper';
import {FlashList} from '@shopify/flash-list';
import UsersList from '../../components/UsersList';
import {user} from '../../utils/user';

export default function Search() {
  const [username, setUsername] = useState('');
  const [acceptedRequests, setAccpetedRequests] = useState<any[]>([]);

  const [users, setUsers] = useState<any[]>([]);

  let filteredData = users.filter(item => {
    return (
      item?.userName?.toLowerCase()?.includes(username.toLowerCase()) &&
      (acceptedRequests ? !acceptedRequests.includes(item?.uid) : true)
    );
  });

  const getAcceptedRequests = useCallback(() => {
    firestore()
      .collection('users')
      .doc(user?.uid)
      .get()
      .then(data => {
        setAccpetedRequests(data?.data()?.chats);
      });
  }, []);

  const getUsers = useCallback(() => {
    let Lists: {
      uid: any;
      userName: any;
      token: any;
      requested: any;
      userImg: any;
      chats: any;
    }[] = [];
    try {
      let ref = firestore()
        .collection('users')
        .where('uid', '!=', auth()?.currentUser?.uid);
      ref.onSnapshot(data => {
        data?.docs?.map(doc => {
          let {uid, userName, requested, token, userImg, chats} = doc.data();
          Lists?.push({
            uid,
            token,
            userName,
            requested,
            userImg,
            chats,
          });
        });
        setUsers(Lists);
      });
    } catch (error) {
      return {error: error};
    }
  }, []);

  const handleChangeInSearch = useCallback((val: any) => {
    setUsername(val);
  }, []);

  useEffect(() => {
    getAcceptedRequests();
    getUsers();
  }, [getAcceptedRequests, getUsers]);

  return (
    <View className="bg-primary flex-1 p-4">
      <View className="flex justify-between ">
        <Text className="font-sans-bold text-white mt-4 text-4xl">Search</Text>
        <Input
          onChangeText={val => handleChangeInSearch(val)}
          textColor="black"
          placeholderTextColor={'black'}
          placeholder="Search"
          className="bg-white mt-2 text-black color-white rounded-full"
          left={<TextInput.Icon color={'black'} icon={'account-search'} />}
        />
        <View className="h-5/6 w-full">
          <FlashList
            showsVerticalScrollIndicator={false}
            estimatedItemSize={200}
            data={filteredData}
            renderItem={({item}) => <UsersList item={item} />}
          />
        </View>
      </View>
    </View>
  );
}
