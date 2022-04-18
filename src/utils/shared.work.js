import {
  CloudCourier,
  ClientboundPongPacket,
  ClientboundWelcomePacket,
  ClientboundMessagePacket,
  ProtocolState,
  ClientboundOnlineMemberPacket,
  ClientboundStrangerPacket,
} from '@cloud-courier/cloud-courier-lib';
import { openDB } from 'idb/with-async-ittr';

const idToPortMap = {};

let instance;

// eslint-disable-next-line no-undef
self.onconnect = e => {
  const port = e.ports[0];
  instance = port;
  port.onmessage = msg => {
    console.log('work线程收到了消息', idToPortMap);
    idToPortMap[msg.data.from] = port;
  };
  const instanceDB = openDB('cloudCourier', 1, {
    upgrade(db) {
      const Store = db.createObjectStore('userList', {
        keyPath: 'id',
        autoIncrement: true,
      });
      Store.createIndex('name', 'name');
      Store.createIndex('target', 'target');
      Store.createIndex('key', 'key');
    },
  });
  const cloudCourier = new CloudCourier({
    // 服务器域名
    serverDomain: 'cccs.sunxinao.cn',
    keepAliveInterval: 20, // 心跳间隔 s
  });
  // eslint-disable-next-line no-undef
  const broadcastChannel = new BroadcastChannel('WebSocketChannel');

  cloudCourier
    .preAuth()
    .then(() => {
      cloudCourier.connect();
    })
    .then(() => {
      console.log('连接成功', cloudCourier);
      broadcastChannel.postMessage({ type: 'WSState', state: cloudCourier.getState() });
    })
    .catch(e => {
      console.error('连接失败', e);
    });

  cloudCourier.addListener({
    packetReceived(event) {
      const session = event.session;
      const packet = event.packet;
      if (packet instanceof ClientboundPongPacket) {
        return;
      }
      if (packet instanceof ClientboundOnlineMemberPacket) {
        return;
      }
      console.log('收到数据: ', packet);
      if (packet instanceof ClientboundWelcomePacket) {
        session.setState(ProtocolState.MESSAGING);
      } else if (packet instanceof ClientboundMessagePacket) {
        // 判断消息是不是自己的，如果是自己的就发送给主线程
        // TODO 其实好像并不用，因为使用就一个用户
        const { content, source, target, timestamp } = packet;
        instanceDB.then(async e => {
          const tx = e.transaction('userList', 'readwrite');
          const index = tx.store.index('key');
          for await (const cursor of index.iterate(source)) {
            const user = { ...cursor.value };
            user.lastDate = timestamp;
            user.message.push({
              content,
              timestamp,
              target,
            });
            cursor.update(user);
          }
          await tx.done;
        });
        broadcastChannel.postMessage({
          type: 'message',
          timestamp,
        });
        // console.log('我收到消息 了packet: ', packet);
      } else if (packet instanceof ClientboundStrangerPacket) {
        /**
         * appKey 群组ID g:10
         * clientVendor 浏览器信息
         * key 访客ID s:xxxxx
         * loaction 位置
         * name 访客名字
         */
        const { appKey, appLogo, appName, avatar, clientVendor, key, location, name } = packet;
        // Add an article:
        instanceDB.then(e => {
          e.getAllFromIndex('userList', 'key', key).then(data => {
            if (data.length === 0) {
              // 如果没查询到该用户把他储存到DB中
              e.add('userList', {
                appKey,
                appLogo,
                appName,
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
        // broadcastChannel.postMessage({
        //   type: 'visitor',
        //   message: {
        //     content,
        //     source,
        //     target,
        //   },
        // });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    packetSent() {},
    packetError(event) {
      if (!event.supress) {
        console.error('解析包失败: ', event.cause);
      }
    },

    disconnected(event) {
      console.error('断开连接', event.reason, event.cause);
    },
  });
};
