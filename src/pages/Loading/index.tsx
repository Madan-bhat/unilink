import {View, Text, PermissionsAndroid} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import {ScreenNames} from '../../utils/screenConfig';
import Image from '../../ui/Image';
import {useDispatch} from 'react-redux';
import {updateCurrentUser} from '../../redux/user.slice';

export default function Loading() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    setTimeout(() => {
      auth().onAuthStateChanged(user => {
        if (user) {
          const userRef = firestore().collection('users').doc(user?.uid);
          userRef.onSnapshot(data => {
            dispatch(updateCurrentUser(data?.data()));
          });
          userRef.update({status: 'online'});
          messaging()
            .getToken()
            .then(fcm => {
              firestore().collection('users').doc(user?.uid).update({
                token: fcm,
              });
            });
          navigation.replace(ScreenNames.dashboard);
        } else {
          navigation.replace(ScreenNames.login);
        }
      });
    }, 2000);
  }, [dispatch, navigation]);

  return (
    <View className="items-center h-full justify-center">
      <Image
        source={require('../../assets/chat.png')}
        resizeMode="contain"
        className="h-32 w-32"
      />
      <Text className="font-sans-bold  text-slate-900 mt-4 text-[50px]">
        UniLink
      </Text>
      <Text className="absolute bottom-4 text-black font-sans">
        Made For Class
      </Text>
    </View>
  );
}
