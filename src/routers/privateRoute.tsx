import type { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteProps, useLocation } from 'react-router';
import Empty from '@/components/Empty/index';
// import useStore from '@src/stores/user'

const PrivateRoute: FC<RouteProps> = props => {
  const location = useLocation();
  const { pathname } = location;
  // TODO 这里需要添加权限验证
  // const logged = useStore((state) => state.logged)
  const logged = true; // 这里做登录验证

  return (
    logged ? (
      pathname === '/' ? (
        <Navigate to={{ pathname: `/customer/chat` }} replace />
      ) : (
        props.element
      )
    ) : (
      <Empty title="没有权限" description="您还没有登录，请先去登录" type="403" />
    )
  ) as JSX.Element;
};

export default PrivateRoute;
