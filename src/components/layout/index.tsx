import { Layout } from '@douyinfe/semi-ui';
import Sider from './components/sider';
import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SuspendFallbackLoading from '../fallback-loading';
import { createContext } from 'react';
import { openDB } from 'idb';
import { useAppDispatch } from '@/hooks/store';
import { updateMessage } from '@/store/message.slice';

export const MsgContext = createContext([]);
export default () => {
  const dispatch = useAppDispatch();
  const { Content } = Layout;
  useEffect(() => {
    const sharedWorker = new SharedWorker('http://localhost:8080/shared.worker.js');
    let webSocketState = WebSocket.CONNECTING;
    const broadcastChannel = new BroadcastChannel('WebSocketChannel');
    broadcastChannel.addEventListener('message', event => {
      switch (event.data.type) {
        case 'WSState':
          webSocketState = event.data.state;
          openDB('cloudCourier').then(db => {
            db.getAll('userList').then(res => {
              dispatch(updateMessage(res));
            });
          });
          break;
        case 'message':
          dispatch(updateMessage(event.data.message));
          break;
        case 'instance':
          // 监听新消息的时间，来判断是否去传递新的消息
          console.log(event.data.instance);
          break;
        default:
          break;
      }
    });
    // 只用请求一次，防止请求两次导致WS连接失败
  }, []);
  return (
    <Layout>
      <Sider />
      <Layout style={{ marginLeft: '60px' }}>
        <Content>
          <Suspense fallback={<SuspendFallbackLoading message="正在加载中" />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
