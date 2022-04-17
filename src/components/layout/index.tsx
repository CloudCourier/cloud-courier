import { Layout } from '@douyinfe/semi-ui';
import Sider from './components/sider';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SuspendFallbackLoading from '../fallback-loading';
import './index.scss';

export default () => {
  const { Content } = Layout;
  return (
    <Layout className="layout-page">
      <Sider />
      <Layout style={{ marginLeft: '60px' }}>
        <Content className="layout-content">
          <Suspense fallback={<SuspendFallbackLoading message="正在加载中" />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
