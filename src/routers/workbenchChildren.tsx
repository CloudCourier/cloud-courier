import { lazy } from 'react';
import { WrapperRouteComponent } from './config';
const WorkbenchDashboard = lazy(() => import('@/pages/Workbench/Dashboard/index'));
const WorkbenchMySubject = lazy(() => import('@/pages/Workbench/MySubject/index'));
const WorkbenchJoinedSubject = lazy(() => import('@/pages/Workbench/JoinedSubject/index'));
const Workbenchinvitations = lazy(() => import('@/pages/Workbench/Invitations/index'));
const User = lazy(() => import('@/pages/Workbench/User/index'));
const workbenchChildren = [
  {
    path: 'dashboard',
    element: <WrapperRouteComponent element={<WorkbenchDashboard />} titleId="工作台" auth />,
  },
  {
    path: 'mysubject',
    element: <WrapperRouteComponent element={<WorkbenchMySubject />} titleId="我的组织" auth />,
  },
  {
    path: 'joinedsubject',
    element: <WrapperRouteComponent element={<WorkbenchJoinedSubject />} titleId="组织列表" auth />,
  },
  {
    path: 'user',
    element: <WrapperRouteComponent element={<User />} titleId="个人中心" auth />,
  },
  {
    path: 'invitations',
    element: <WrapperRouteComponent element={<Workbenchinvitations />} titleId="我的邀请" auth />,
  },
];
export default workbenchChildren;

// 将配置好的路由分发出去，让tabs组件去渲染
const workbenchChildrenKey = workbenchChildren.reduce(
  (pre, cur) => [
    ...pre,
    {
      path: cur.path,
      name: cur.element.props.titleId,
      key: cur.path,
      closable: cur.path === 'dashboard' ? false : true,
    },
  ],
  [],
);
export { workbenchChildrenKey };
