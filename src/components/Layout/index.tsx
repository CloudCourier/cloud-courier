import { Banner, Button, Empty, Layout } from '@douyinfe/semi-ui';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import Sider from './components/sider';
import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SuspendFallbackLoading from '../SuspendFallback';
import { openDB } from 'idb';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import messageSlice, { updateMessage } from '@/store/message.slice';
import { getInfo } from '@/api/user';
import { BROAD_CAST_CHANNEL } from '@/consts';

export default () => {
  const [bannerVisible, setBannerVisible] = useState(false);
  const dispatch = useAppDispatch();
  const userMessage = useAppSelector(state => state.message.message);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [noWorker, setNoWorker] = useState(false);
  const { Content } = Layout;
  const initMsg = () => {
    openDB('cloudCourier').then(db => {
      db.getAll('userList').then(res => {
        dispatch(updateMessage(res));
      });
    });
  };
  useEffect(() => {
    getInfo(); //判断是否登录
    if (!window.SharedWorker) {
      setNoWorker(true);
      return;
    }
    const sharedworker = new SharedWorker(`${process.env.API_LOCAL}/shared.worker.js`);
    sharedworker.port.start();
    let webSocketState = WebSocket.CONNECTING;
    const broadcastChannel = new BroadcastChannel(BROAD_CAST_CHANNEL);
    broadcastChannel.addEventListener('message', event => {
      const { type, key } = event.data;
      switch (type) {
        case 'WSState':
          webSocketState = event.data.state;
          initMsg();
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
        case 'newWs':
          if (userMessage.length === 0) {
            initMsg();
          }
          break;
        case 'reconnect':
          setReconnectCount(event.data.message);
          break;
        default:
          break;
      }
    });
    // 只用请求一次，防止请求两次导致WS连接失败
  }, []);

  return (
    <>
      {noWorker ? (
        <Banner
          type="info"
          icon={null}
          fullMode={true}
          description={
            <Empty
              image={<IllustrationConstruction style={{ width: 350, height: 350 }} />}
              darkModeImage={<IllustrationConstructionDark style={{ width: 350, height: 350 }} />}
              title={'请使用 PC 设备访问本网站'}
              description="当前设备暂未开放，敬请期待。"
            />
          }
        />
      ) : (
        <Layout>
          <Sider />
          <Layout style={{ marginLeft: '60px' }}>
            {bannerVisible && (
              <Banner
                onClose={() => setBannerVisible(!bannerVisible)}
                type="danger"
                description={
                  <div>
                    断开连接，正在尝试重新第<b>{reconnectCount}</b>
                    次重连，若系统第三次重连失败后，您可尝试刷新页面进行重新连接。
                  </div>
                }
              />
            )}
            <Content>
              <Suspense fallback={<SuspendFallbackLoading message="正在加载中" />}>
                <Outlet />
              </Suspense>
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};
