import {View, Text, PermissionsAndroid} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {ScreenNames} from '../../utils/screenConfig';

export default function Loading() {
  const navigation = useNavigation();
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    auth().onAuthStateChanged(user => {
      if (user) {
        const userRef = firestore().collection('users').doc(user?.uid);
        userRef.update({status: 'online'});
        messaging()
          .getToken()
          .then(fcm => {
            console.log(fcm);
            firestore().collection('users').doc(user?.uid).update({
              token: fcm,
            });
          });
        navigation.navigate(ScreenNames.dashboard);
      } else {
        navigation.navigate(ScreenNames.login);
      }
    });
  }, [navigation]);

  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
}
