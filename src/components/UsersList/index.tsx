import {View, TouchableOpacity, ToastAndroid} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Text from '../../ui/Text';
import Image from '../../ui/Image';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ScreenNames} from '../../utils/screenConfig';

function UsersList({item}: any) {
  const [requested, setRequested] = useState<boolean | undefined>(undefined);

  const getRequestedList = useCallback(() => {
    const currentUserUid = auth().currentUser?.uid;
    const userRef = firestore().collection('users').doc(currentUserUid);
    const unsubscribe = userRef.onSnapshot(doc => {
      const userData = doc.data();
      if (userData && userData.requested) {
        const isRequested = userData.requested.includes(item?.uid);
        setRequested(isRequested);
      }
    });
    return () => unsubscribe();
  }, [item?.uid]);

  const sendPushNotification = useCallback(async () => {
    const FIREBASE_API_KEY =
      'AAAAaSe6Jzk:APA91bFvk4flDI24veCqiDWnMFh_xDKmANQy2M0n0lfNVHdi9Qits1Un4crvhMMpNblesweZ5EDk66BkUlHG95Uh82cVjvy9jwLV89Bm6LmRIXLLz91g_F3AAszAL6-8o0hCrYApSArz';
    const message = {
      to: `${item?.token}`,
      notification: {
        body: 'New Request Available',
        OrganizationId: '2',
        content_available: true,
        priority: 'high',
        subtitle: '',
        title: item?.userName,
      },
      data: {
        screen: ScreenNames.requests,
      },
    };
    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'key=' + FIREBASE_API_KEY,
    });
    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    }).then(_response => {
      return _response?.json();
    });
  }, [item?.token, item?.userName]);

  const onRequest = useCallback(() => {
    try {
      firestore()
        .collection('users')
        .doc(auth()?.currentUser?.uid)
        .update({
          requested: requested
            ? firestore.FieldValue.arrayRemove(item?.uid)
            : firestore.FieldValue.arrayUnion(item?.uid),
        })
        .catch(e => console.log(e))
        .then(() => {
          firestore()
            .collection('users')
            .doc(item?.uid)
            .update({
              requests: requested
                ? firestore.FieldValue.arrayRemove(auth()?.currentUser?.uid)
                : firestore.FieldValue.arrayUnion(auth()?.currentUser?.uid),
            });
        });
      sendPushNotification();
    } catch (error) {}
  }, [item?.uid, requested, sendPushNotification]);

  useEffect(() => {
    getRequestedList();
  }, [getRequestedList]);

  return (
    <View className="bg-white-900 p-2 rounded-md bg-primary my-2 w-full">
      <View className="flex-row items-center justify-between">
        <View className="items-center flex-row">
          <Image
            source={{
              uri: item.userImg
                ? item?.userImg
                : 'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
            }}
            className="h-12 rounded-full w-12"
          />
          <View className="ml-2">
            <Text
              ellipsizeMode="tail"
              className="text-white max-w-[px] text-lg font-sans">
              {item.userName}
            </Text>
            <Text>{item?.description || 'No Description'}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onRequest}
          className="mr-0 p-1 px-2 rounded-md items-center justify-center bg-white">
          <Text className="text-md text-primary font-sans">
            {requested ? 'Cancel Request' : 'Request'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(UsersList);
