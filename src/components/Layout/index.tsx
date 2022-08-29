import { Layout } from '@douyinfe/semi-ui';
import Sider from './components/sider';
import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SuspendFallbackLoading from '../SuspendFallback';
import { openDB } from 'idb';
import { useAppDispatch } from '@/hooks/store';
import { updateMessage } from '@/store/message.slice';
import { getInfo } from '@/api/user';
import { BROAD_CAST_CHANNEL } from '@/const';

export default () => {
  const dispatch = useAppDispatch();
  const { Content } = Layout;
  useEffect(() => {
    getInfo(); //判断是否登录
    new SharedWorker(`${process.env.API_LOCAL}/shared.worker.js`);
    let webSocketState = WebSocket.CONNECTING;
    const broadcastChannel = new BroadcastChannel(BROAD_CAST_CHANNEL);
    broadcastChannel.addEventListener('message', event => {
      const { type, key } = event.data;
      switch (type) {
        case 'WSState':
          webSocketState = event.data.state;
          // TODO: 放到worker操作返回
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
        case 'ServerboundDeleteChatListPacket_send':
          console.log(key);

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
