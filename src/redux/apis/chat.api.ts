import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import firestore from '@react-native-firebase/firestore';

export const chat = createApi({
  reducerPath: 'chat',
  baseQuery: fakeBaseQuery(),
  endpoints: build => ({
    getMessages: build?.query({
      queryFn() {
        try {
          return {data: null};
        } catch (error) {}
      },
    }),
  }),
});
