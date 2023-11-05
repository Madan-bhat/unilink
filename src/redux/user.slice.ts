import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: {},
    chatUser: {},
  },
  reducers: {
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateChatUser: (state, action) => {
      state.chatUser = action.payload;
    },
  },
});

export const {updateChatUser, updateCurrentUser} = userSlice.actions;
export default userSlice;
