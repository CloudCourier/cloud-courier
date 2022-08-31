import { lazy, FC } from 'react';
import type { RouteObject } from 'react-router';
import { useRoutes } from 'react-router-dom';
import LoginPage from '@/pages/Unauthorized/Login';
import RegisterPage from '@/pages/Unauthorized/Register';
import LayoutPage from '@/components/Layout';
import Empty from '@/components/Empty/index';
import { WrapperRouteComponent, WrapperRouteWithOutLayoutComponent } from './config';
import workbenchChildren from '@/routers/workbenchChildren';

const CustomerChat = lazy(() => import('@/pages/Message/index'));
const WorkBench = lazy(() => import('@/pages/Workbench/index'));
const KnowLedgeRelease = lazy(() => import('@/pages/Workbench/Knowledge/Release'));

const Abnormal403 = lazy(() => import('@/pages/Abnormal/403/index'));
const Abnormal404 = lazy(() => import('@/pages/Abnormal/404/index'));
const Abnormal500 = lazy(() => import('@/pages/Abnormal/500/index'));

const routeList: RouteObject[] = [
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} titleId="" auth />,
    children: [
      {
        path: 'customer/chat',
        element: <WrapperRouteComponent element={<CustomerChat />} titleId="聊天页" auth />,
      },
      {
        path: 'workbench',
        element: <WrapperRouteComponent element={<WorkBench />} titleId="工作台" auth />,
        children: workbenchChildren,
      },
      {
        path: 'abnormal/403',
        element: <WrapperRouteComponent element={<Abnormal403 />} titleId="403" auth />,
      },
      {
        path: 'abnormal/404',
        element: <WrapperRouteComponent element={<Abnormal404 />} titleId="404" auth />,
      },
      {
        path: 'abnormal/500',
        element: <WrapperRouteComponent element={<Abnormal500 />} titleId="500" auth />,
      },
    ],
  },
  {
    path: 'workbench/knowledge/release/:id',
    element: (
      <WrapperRouteWithOutLayoutComponent element={<KnowLedgeRelease />} titleId="撰写文章" auth />
    ),
  },
  {
    path: 'login',
    element: <WrapperRouteWithOutLayoutComponent element={<LoginPage />} titleId="登录" />,
  },
  {
    path: 'register',
    element: <WrapperRouteWithOutLayoutComponent element={<RegisterPage />} titleId="注册" />,
  },
  {
    path: '*',
    element: (
      <WrapperRouteWithOutLayoutComponent
        element={<Empty title="找不到咯" description="这里什么也没有~" type="404" />}
        titleId="404"
      />
    ),
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;
