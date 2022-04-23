import { createSlice } from '@reduxjs/toolkit';
import { workbenchChildrenKey } from '@/routers/workbenchChildren';

export const workbenchListSlice = createSlice({
  name: 'workbenchList',
  initialState: {
    workbenchList: [workbenchChildrenKey[0]],
    activeKey: workbenchChildrenKey[0].key,
  },
  reducers: {
    addWorkbenchList(state, { payload }) {
      if (state.workbenchList.filter(item => item.key === payload).length === 0) {
        state.workbenchList = state.workbenchList.concat(
          workbenchChildrenKey.filter(item => item.key === payload)[0],
        );
      }
    },
    removeWorkbenchList(state, { payload }) {
      state.workbenchList = state.workbenchList.filter(item => item.key !== payload);
    },
    setActiveKey(state, { payload }) {
      state.activeKey = payload;
    },
  },
});
export default workbenchListSlice.reducer;
export const { addWorkbenchList, removeWorkbenchList, setActiveKey } = workbenchListSlice.actions;
