import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import firestore from '@react-native-firebase/firestore';

import {updateChatUser} from '../redux/user.slice';

export default function useChatUser({uid}: {uid: string}) {
  const [user, setUser] = useState<any>();
  const dispatch = useDispatch();

  const getUser = useCallback(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(_data => {
        setUser(_data?.data());
        dispatch(updateChatUser(_data?.data()));
      });
    return () => unsubscribe();
  }, [dispatch, uid]);

  useEffect(() => {
    let unsubscribe = getUser();
    return () => unsubscribe();
  }, []);

  return user;
}
