import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQuery} from '../redux.config';

export const chat = createApi({
  reducerPath: 'chat',
  baseQuery,
  endpoints: build => ({
    messages: build.query({
      query: (docId: any) => ({
        method: 'GET',
        url: '/api/messages/',
        body: {
          docId,
        },
      }),
    }),
    readMessage: build.mutation({
      query: docId => ({
        method: 'POST',
        url: '/api/readMessage',
        body: {
          docId,
        },
      }),
    }),
    getSearchUsers: build.query({
      query: () => {
        return {
          method: 'GET',
          url: `/api/getSearchUsers/NpNcOguqlaQnex9zntcIr6A7PF22`,
        };
      },
    }),
    getUser: build.query({
      query: uid => ({
        method: 'GET',
        url: '/api/getUser',
        body: {
          uid,
        },
      }),
    }),
    like: build.mutation({
      query: body => ({
        method: 'POST',
        url: '/api/like/',
        body,
      }),
    }),
  }),
});

export const {
  useMessagesQuery,
  useGetUserQuery,
  useGetSearchUsersQuery,
  useLikeMutation,
  useReadMessageMutation,
} = chat;
