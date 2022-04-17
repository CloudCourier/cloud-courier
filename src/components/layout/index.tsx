import { Layout } from '@douyinfe/semi-ui';
import Sider from './components/sider';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SuspendFallbackLoading from '../fallback-loading';
import { v4 as uuidv4 } from 'uuid';
import './index.scss';

export default () => {
  const { Content } = Layout;
  const id = uuidv4();

  // const sharedworker = new SharedWorker('http://localhost:9000/js/work.bundle.js');
  // sharedworker.port.onmessage = e => {
  //   console.log(`主线程 ：${e.data}`);
  // };
  // // TODO  把用户的 ID 传给他，然后 SharedWorker 用一个对象保存起来，每次收到消息后，如果是自己的消息就用 取到对应的MessagePort，然后发送消息
  // sharedworker.port.postMessage({
  //   from: id,
  // });
  // // 待认证 = 0 通信 = 1 预认证/未连接 = 3
  // let webSocketState = WebSocket.CONNECTING;

  // // Listen to broadcasts from server
  // function handleBroadcast(data: any) {
  //   console.log('This message is meant for everyone!');
  //   console.log(data);
  // }
  // const broadcastChannel = new BroadcastChannel('WebSocketChannel');
  // broadcastChannel.addEventListener('message', event => {
  //   switch (event.data.type) {
  //     case 'WSState':
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       webSocketState = event.data.state;
  //       console.log('WebSocketState:', webSocketState);
  //       break;
  //     case 'message':
  //       handleBroadcast(event.data.message);
  //       break;
  //     default:
  //       break;
  //   }
  // });
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
