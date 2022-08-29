import { createSlice } from '@reduxjs/toolkit';

export const messageSlice = createSlice({
  name: 'messageSlice',
  initialState: {
    message: [],
  },
  reducers: {
    updateMessage: (state, { payload }) => {
      state.message = payload;
    },
  },
});
export default messageSlice.reducer;
export const { updateMessage } = messageSlice.actions;
