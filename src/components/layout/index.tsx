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
    const sharedworker = new SharedWorker(`${process.env.API_LOCAL}/sharedwork.js`);
    sharedworker.port.onmessage = e => {
      console.log(`主线程 ：${e.data}`);
    };
    let webSocketState = WebSocket.CONNECTING;
    const broadcastChannel = new BroadcastChannel('WebSocketChannel');
    broadcastChannel.addEventListener('message', event => {
      switch (event.data.type) {
        case 'WSState':
          webSocketState = event.data.state;
          console.log('WebSocketState:', webSocketState);
          break;
        case 'message':
          // 监听新消息的时间，来判断是否去传递新的消息
          // setTime(event.data.timestamp);
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
  useEffect(() => {
    // 初始化消息
    // TODO 无消息列表的时候会报错，带历史消息出来后再解决
    openDB('cloudCourier').then(db => {
      db.getAll('userList').then(res => {
        dispatch(updateMessage(res));
      });
    });
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
