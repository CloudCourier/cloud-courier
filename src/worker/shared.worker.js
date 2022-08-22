import {
  CloudCourier,
  ClientboundPongPacket,
  ClientboundWelcomePacket,
  ClientboundMessagePacket,
  ProtocolState,
  ClientboundOnlineMemberPacket,
  ClientboundStrangerPacket,
  ServerboundMessagePacket,
  ServerboundHistoryPacket,
  ClientboundHistoryPacket,
  ClientboundDisconnectPacket,
} from '@cloud-courier/cloud-courier-lib';
import { openDB } from 'idb/with-async-ittr';
import { debounce } from 'lodash';
import Long from 'long';
// eslint-disable-next-line no-undef
const instanceDB = openDB('cloudCourier', 1, {
  upgrade(db) {
    const store = db.createObjectStore('userList', {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('name', 'name');
    store.createIndex('target', 'target');
    store.createIndex('key', 'key');
  },
});
const cloudCourier = new CloudCourier({
  // 服务器域名
  serverDomain: 'cccs.sunxinao.cn',
  keepAliveInterval: 20, // 心跳间隔 s
});
// eslint-disable-next-line no-undef
const broadcastChannel = new BroadcastChannel('WebSocketChannel');
broadcastChannel.onmessage = debounce(e => {
  const { type, id, message } = e.data;
  if (type === 'sendRequest') {
    cloudCourier.send(new ServerboundMessagePacket(id, message));
  }
}, 100);

function storeMsg(packet) {
  let { content, source, target, timestamp } = packet;
  // 将 Long 型的时间转换成 number
  timestamp = timestamp.toNumber();
  // 没有对象的时候先创建
  instanceDB.then(async db => {
    // TODO tx undefined

    const tx = db.transaction('userList', 'readwrite');
    const index = tx.store.index('key');
    // 遍历 userID === source 的对象,将消息加进去
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

    db.getAll('userList').then(message => {
      broadcastChannel.postMessage({
        type: 'message',
        message,
      });
    });
  });
}

cloudCourier
  .preAuth()
  .then(() => {
    cloudCourier.connect();
  })
  .then(() => {
    console.log('连接成功', cloudCourier.getState());
    broadcastChannel.postMessage({ type: 'WSState', state: cloudCourier.getState() });
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
      cloudCourier.send(new ServerboundHistoryPacket('', Long.fromNumber(Date.now()), 2147483647));
    }, 1000);
  })
  .catch(e => {
    console.error('连接失败', e);
  });

cloudCourier.addListener({
  packetReceived(event) {
    const session = event.session;
    const packet = event.packet;
    if (packet instanceof ClientboundHistoryPacket) {
      console.log('历史消息', packet);
      // packet.messages.forEach(historyPacket => {
      //   storeMsg(historyPacket);
      // });
    }
    if (packet instanceof ClientboundPongPacket) {
      // 心跳包
      return;
    }
    if (packet instanceof ClientboundOnlineMemberPacket) {
      return;
    }
    if (packet instanceof ClientboundWelcomePacket) {
      session.setState(ProtocolState.MESSAGING);
    } else if (packet instanceof ClientboundMessagePacket) {
      // 判断消息是不是自己的，如果是自己的就发送给主线程
      // TODO 其实好像并不用，因为使用就一个用户
      storeMsg(packet);
      // console.log('我收到消息 了 packet: ', packet);
    } else if (packet instanceof ClientboundStrangerPacket) {
      console.log('来访客了', packet);
      /*
      来访客了
      appKey 群组 ID g:10
      clientVendor 浏览器信息
      key 访客 ID s:xxxxx
      loaction 位置
      name 访客名字
      */
      const { appKey, appLogo, appName, avatar, clientVendor, key, location, name } = packet;
      // Add an user:
      instanceDB.then(e => {
        e.getAllFromIndex('userList', 'key', key).then(data => {
          if (data.length === 0) {
            // 如果没查询到该用户把他储存到 DB 中
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
      // type: 'visitor',
      // message: {
      // content,
      // source,
      // target,
      // },
      // });
    } else if (packet instanceof ClientboundDisconnectPacket) {
      console.log('断开链接packet', packet);
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
          broadcastChannel.postMessage({
            type: 'message',
            message,
          });
        });
      });
    } else if (packet instanceof ServerboundHistoryPacket) {
      console.log('packetsent', packet);
    }
  },
  packetError(event) {
    if (!event.supress) {
      console.error('解析包失败: ', event.cause);
    }
  },

  disconnected(event) {
    console.error('断开连接', event.reason, event.cause);
  },
});
