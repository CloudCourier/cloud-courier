import { createSlice } from '@reduxjs/toolkit';

export const messageSlice = createSlice({
  name: 'messageSlice',
  initialState: {
    message: [],
    lastMessageTime: 0,
  },
  reducers: {
    updateMessage: (state, { payload }) => {
      state.message = payload;
    },
    updateLastMessageTime: (state, { payload }) => {
      state.lastMessageTime = payload;
    },
  },
});
export default messageSlice.reducer;
export const { updateMessage, updateLastMessageTime } = messageSlice.actions;
