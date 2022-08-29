import {
  ClientboundPongPacket,
  ClientboundWelcomePacket,
  CloudCourier,
  DisconnectedEvent,
  PacketErrorEvent,
  PacketReceivedEvent,
  ProtocolState,
  ClientboundMessagePacket,
  ClientboundAssignMemberPacket,
  ServerboundMessagePacket,
  ClientboundStrangerPacket,
} from '@cloud-courier/cloud-courier-lib';
import { openDB } from 'idb/with-async-ittr';
import { useRef, useState } from 'react';
import useMemoizedFn from '@/hooks/useMemoizedFn';
import useUnmount from '@/hooks/useUnmount';

export interface Options {
  reconnectLimit?: number;
  reconnectInterval?: number;
}

export interface Result {
  sendMessage?: (msg: string) => void;
  disconnect?: () => void;
  connect?: () => void;
  readyState: ReadyState;
  webSocketIns?: WebSocket;
}

/**
 * @param {string} projectToken 访问网站的 projectToken
 * @param {string} name 访客名字
 * @param {object} options 选项
 * @description 初始化客服实例
 */
export default function useCourier(
  //
  Options: Options = {},
) {
  const { reconnectLimit = 3, reconnectInterval = 3 * 1000 } = Options;
  const [message, setMessage] = useState([]);
  const [courierKey, setCourierKey] = useState('');
  const [courierName, setCourierName] = useState('排队中');
  const [avatar, setAvatar] = useState('');
  const cloudCourierRef = useRef<CloudCourier>();
  const [readyState, setReadyState] = useState<ProtocolState>(ProtocolState.PRE_AUTH);

  const reconnectTimesRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const unmountedRef = useRef(false);
  // 初始化数据库实例
  const instanceDB = openDB('cloudCourier', 1, {
    upgrade(db) {
      console.log('db :', db);
      const Store = db.createObjectStore('userList', {
        keyPath: 'id',
        autoIncrement: true,
      });
      Store.createIndex('name', 'name');
      Store.createIndex('target', 'target');
      Store.createIndex('key', 'key');
    },
  });

  /**
   * @description 重连
   */
  const reconnect = () => {
    if (
      reconnectTimesRef.current < reconnectLimit &&
      cloudCourierRef.current?.getState() !== ProtocolState.MESSAGING
    ) {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      reconnectTimerRef.current = setTimeout(() => {
        connectWs();
        reconnectTimesRef.current++;
      }, reconnectInterval);
    }
  };

  /**
   * @description 初始化Websocket实例
   */
  const connectWs = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    if (cloudCourierRef.current) {
      cloudCourierRef.current.close();
    }

    // 初始化客户端
    const cloudCourier: CloudCourier = new CloudCourier({
      // 服务器域名
      serverDomain: 'cccs.sunxinao.cn',
      keepAliveInterval: 20, // 心跳间隔 s
    });
    // 预认证
    cloudCourier
      .preAuth()
      .then(() => {
        if (unmountedRef.current) {
          return;
        }
        reconnectTimesRef.current = 0;
        setReadyState(cloudCourier.getState() || ProtocolState.LOGIN);
        return cloudCourier.connect();
      })
      .then(() => {
        if (unmountedRef.current) {
          return;
        }
        cloudCourierRef.current = cloudCourier;
        setReadyState(cloudCourier.getState() || ProtocolState.MESSAGING);
        cloudCourier.addListener({
          packetReceived(event: PacketReceivedEvent) {
            const { session } = event;
            const { packet } = event;
            if (packet instanceof ClientboundPongPacket) {
              return;
            }
            // 使用 if 而不是使用 switch 是为了使用 instaceof 使其强制类型转换
            if (packet instanceof ClientboundWelcomePacket) {
              session.setState(ProtocolState.MESSAGING);
            } else if (packet instanceof ClientboundMessagePacket) {
              // 接收到消息
              const { content, source, target } = packet;
              const timestamp = packet.timestamp.toNumber();
              instanceDB.then(async db => {
                const tx = db.transaction('userList', 'readwrite');
                const index = tx.store.index('key');
                // 遍历 userID === source 的对象,将消息加进去
                for await (const cursor of index.iterate(source)) {
                  const user = { ...cursor.value };
                  user.lastDate = timestamp;
                  user.message.push({
                    content,
                    timestamp,
                    source,
                    target,
                  });
                  cursor.update(user);
                }
                await tx.done;
                // 返回信息,防止多个窗口同时聊天，消息不同步
                db.getAll('userList').then(message => {
                  setMessage(message);
                });
              });
            } else if (packet instanceof ClientboundStrangerPacket) {
              /*
               * 来访客了
               * appKey 群组ID g:10
               * clientVendor 浏览器信息
               * key 访客ID s:xxxxx
               * loaction 位置
               * name 访客名字
               */
              const { appKey, avatar, clientVendor, key, location, name } = packet;
              // Add an user:
              instanceDB.then(e => {
                e.getAllFromIndex('userList', 'key', key).then(data => {
                  if (data.length === 0) {
                    // 如果没查询到该用户把他储存到DB中
                    e.add('userList', {
                      appKey,
                      avatar,
                      clientVendor,
                      key,
                      location,
                      name,
                      message: [],
                    });
                  }
                });
              });
            }
          },
          packetSent({ packet }) {
            if (packet instanceof ServerboundMessagePacket) {
              const { content, target } = packet;
              const timestamp = Date.now();
              instanceDB.then(async e => {
                const tx = e.transaction('userList', 'readwrite');
                const index = tx.store.index('key');
                // 遍历 userID === source 的对象,将消息加进去
                for await (const cursor of index.iterate(target)) {
                  const user = { ...cursor.value };
                  user.message.push({
                    content,
                    timestamp,
                    target,
                  });
                  cursor.update(user);
                }
                await tx.done;
                e.getAll('userList').then(message => {
                  setMessage(message);
                });
              });
            }
          },
          packetError(event: PacketErrorEvent) {
            if (!event.supress) {
              console.error('解析包失败: ', event.cause);
            }
          },
          disconnected(event: DisconnectedEvent) {
            console.error('断开连接', event.reason, event.cause, cloudCourier);
            if (unmountedRef.current) {
              return;
            }
            setCourierName('断开连接');
            setReadyState(cloudCourier.getState() || ProtocolState.PRE_AUTH);
            reconnect();
          },
        });
      })
      .catch(e => {
        console.error('连接失败', e);

        setCourierName('连接失败');
        setReadyState(cloudCourier.getState() || ProtocolState.PRE_AUTH);
      });
  };
  /**
   * fa
   * @param message 消息内容
   */
  const sendMessage = (message: string) => {
    if (readyState === ProtocolState.MESSAGING) {
      cloudCourierRef.current?.send(new ServerboundMessagePacket(courierKey, message));
    } else {
      throw new Error('WebSocket disconnected');
    }
  };
  const connect = () => {
    reconnectTimesRef.current = 0;
    return connectWs();
  };
  const disconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    reconnectTimesRef.current = reconnectLimit;
    cloudCourierRef.current?.close();
  };

  // 组件销毁时，实例关闭
  useUnmount(() => {
    unmountedRef.current = true;
    disconnect();
  });
  return {
    cloudCourier: cloudCourierRef.current,
    courierName,
    avatar,
    courierKey,
    message,
    readyState,
    connect: useMemoizedFn(connect),
    sendMessage: useMemoizedFn(sendMessage),
  };
}
