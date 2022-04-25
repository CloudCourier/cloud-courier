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

// 大量使用 redux 是因为，防止 context state props 使父组件拥有状态，从而导致下面的所有组件在每次渲染时都会 render，即使有些值没有变化，因为DIFF是深比较，导致性能问题
