import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import firestore from '@react-native-firebase/firestore';

export const chat = createApi({
  reducerPath: 'chat',
  baseQuery: fakeBaseQuery(),
  endpoints: build => ({}),
});
