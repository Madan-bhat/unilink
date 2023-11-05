import {createSlice} from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
  },
  reducers: {
    updateMessages: (state, action) => {
      console.log(action);
      state.messages = action.payload;
    },
  },
});

export const {updateMessages} = chatSlice.actions;
export default chatSlice;
