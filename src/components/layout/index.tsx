import { Layout } from '@douyinfe/semi-ui';
import Sider from './components/sider';
import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SuspendFallbackLoading from '../fallback-loading';
import { createContext } from 'react';
import { useState } from 'react';
import { openDB } from 'idb';

export const MsgContext = createContext([]);
export default () => {
  const { Content } = Layout;
  const [messageList, setMessageList] = useState([]);
  const [time, setTime] = useState(1);
  useEffect(() => {
    const sharedworker = new SharedWorker('http://localhost:9000/js/work.bundle.js');
    sharedworker.port.onmessage = e => {
      console.log(`主线程 ：${e.data}`);
    };

    // 待认证 = 0 通信 = 1 预认证/未连接 = 3
    let webSocketState = WebSocket.CONNECTING;

    // Listen to broadcasts from server
    function handleBroadcast(data) {
      setTime(data);
    }
    const broadcastChannel = new BroadcastChannel('WebSocketChannel');
    broadcastChannel.addEventListener('message', event => {
      switch (event.data.type) {
        case 'WSState':
          webSocketState = event.data.state;
          console.log('WebSocketState:', webSocketState);
          break;
        case 'message':
          handleBroadcast(event.data.timestamp);
          break;
        default:
          break;
      }
    });
    // 只用请求一次，防止请求两次导致WS连接失败
  }, []);
  useEffect(() => {
    openDB('cloudCourier').then(db => {
      db.getAll('userList').then(res => {
        setMessageList(res);
      });
    });
  }, [time]);
  return (
    <MsgContext.Provider value={messageList}>
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
    </MsgContext.Provider>
  );
};
