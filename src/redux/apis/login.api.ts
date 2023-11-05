import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ToastAndroid} from 'react-native';

export const login = createApi({
  reducerPath: 'login',
  baseQuery: fakeBaseQuery(),
  endpoints: build => ({
    login: build.mutation({
      async queryFn({email, password}) {
        try {
          await auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => {
              const e = error?.toString().replace(/\[|\]/g, '');
              return ToastAndroid.show(`${e}`, ToastAndroid.LONG);
            });
          return {data: 'SUCCESS'};
        } catch (error) {
          return {error: error};
        }
      },
    }),
    register: build.mutation({
      async queryFn({
        email,
        userName,
        password,
        userImg,
      }: {
        email: string;
        password: string;
        userName: string;
        userImg: string;
      }) {
        try {
          await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(({user}) => {
              user?.updateProfile({
                photoURL: `data:image/png;base64,${userImg}`,
              });
              firestore()
                .collection('users')
                .doc(user?.uid)
                .set({
                  uid: user?.uid,
                  userName,
                  email,
                  groups: [],
                  chats: [],
                  token: '',
                  requests: [],
                  requested: [],
                  createdAt: Date.now(),
                  userImg,
                })
                .catch(e => console.log(e));
            })
            .catch(error => {
              const e = error?.toString().replace(/\[|\]/g, '');
              return ToastAndroid.show(`${e}`, ToastAndroid.LONG);
            });

          return {data: 'SUCCESS'};
        } catch (error) {
          return {
            error: error,
          };
        }
      },
    }),
  }),
});

export const {useLoginMutation, useRegisterMutation} = login;
