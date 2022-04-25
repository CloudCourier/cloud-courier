import { lazy } from 'react';
import { WrapperRouteComponent } from './config';
const WorkbenchDashboard = lazy(() => import('@/pages/workbench/dashboard'));
const WorkbenchSubject = lazy(() => import('@/pages/workbench/subject'));
const User = lazy(() => import('@/pages/workbench/user'));
const workbenchChildren = [
  {
    path: 'dashboard',
    element: <WrapperRouteComponent element={<WorkbenchDashboard />} titleId="工作台" auth />,
  },
  {
    path: 'subject',
    element: <WrapperRouteComponent element={<WorkbenchSubject />} titleId="项目管理" auth />,
  },
  {
    path: 'user',
    element: <WrapperRouteComponent element={<User />} titleId="个人中心" auth />,
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
