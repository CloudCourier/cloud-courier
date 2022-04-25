import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/auth.slice';
import subjectReducer from './subject.slice';
import sideReducer from './sidebar.slice';
// import {connectionSlice} from "./connection.slice";
import globalReducer from './common/global.slice';
import workbenchListReducer from './workbench.slice';
import messageReducer from './message.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sider: sideReducer,
    global: globalReducer,
    workbenchList: workbenchListReducer,
    subject: subjectReducer,
    message: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
