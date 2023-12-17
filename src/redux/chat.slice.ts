import {createSlice} from '@reduxjs/toolkit';

const chatslice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
  },
  reducers: {
    updateMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const {updateMessages} = chatslice.actions;
export default chatslice;
