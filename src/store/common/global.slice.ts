import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    locale: 'zh_CN',
    loading: false,
  },
  reducers: {
    changeLocale(state, { payload }) {
      state.locale = payload;
    },
  },
});

export default globalSlice.reducer;
export const { changeLocale } = globalSlice.actions;
