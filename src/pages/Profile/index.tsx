import {View, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {user} from '../../utils/user';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<any>();

  const getUser = useCallback(() => {
    firestore()
      .collection('users')
      .doc(user?.uid)
      .get()
      .then(_data => {
        setCurrentUser(_data?.data());
      });
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <View className="h-full bg-white">
      <Text>Profile</Text>
    </View>
  );
}
