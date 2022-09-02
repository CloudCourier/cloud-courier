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
  ServerboundHandshakePacket,
  ServerboundAddChatListPacket,
  ServerboundQueryChatListPacket,
  ServerboundQueryServiceHistoryPacket,
  ServerboundQueryStrangerListPacket,
  ServerboundRefreshChatListPacket,
  ClientboundRecentServicesPacket,
  SessionListener,
  PacketReceivedEvent,
  PacketErrorEvent,
  DisconnectedEvent,
  PacketSentEvent,
  ClientboundSyncSubjectsPacket,
  ClientboundServiceHistoryPacket,
  ServerboundDeleteChatListPacket,
  ClientboundChatListPacket,
  ClientboundRecentChatListPacket,
} from '@cloud-courier/cloud-courier-lib';
import { IDBPDatabase, openDB } from 'idb/with-async-ittr';
import { debounce } from 'lodash';
import Long from 'long';
import { BROAD_CAST_CHANNEL, MESSAGE_MAX_COUNT } from '../consts';

const instanceDB = openDB('cloudCourier', 1, {
  upgrade(db) {
    const userStore = db.createObjectStore('userList', {
      keyPath: 'key',
    });
    userStore.createIndex('name', 'name');
    userStore.createIndex('target', 'target');
    userStore.createIndex('key', 'key');

    const subjectStore = db.createObjectStore('subjectList', {
      keyPath: 'id',
      autoIncrement: true,
    });
    subjectStore.createIndex('subjectId', 'subjectId');
  },
});
const cloudCourier = new CloudCourier({
  // 服务器域名
  serverDomain: 'cccs.sunxinao.cn',
  keepAliveInterval: 20, // 心跳间隔 s
});

const broadCastMyMessage = (db: IDBPDatabase) => {
  db.getAll('userList').then(message => {
    broadCastChannel.postMessage({
      type: 'message',
      message,
    });
  });
};

const broadCastChannel = new BroadcastChannel(BROAD_CAST_CHANNEL);
broadCastChannel.onmessage = debounce(e => {
  const { type, key, message } = e.data;
  switch (type) {
    case 'sendRequest':
      cloudCourier.send(new ServerboundMessagePacket(key, message));
      break;
    case 'ServerboundQueryServiceHistoryPacket':
      // 查询历史服务
      cloudCourier.send(
        new ServerboundQueryServiceHistoryPacket(
          Long.fromNumber(0),
          key,
          Long.fromNumber(Date.now()),
          MESSAGE_MAX_COUNT,
        ),
      );
      break;
    case 'ServerboundDeleteChatListPacket':
      cloudCourier.send(new ServerboundDeleteChatListPacket(key));
      break;
    case 'ServerboundAddChatListPacket':
      cloudCourier.send(new ServerboundAddChatListPacket(key, message));
      // 乐观更新个性化配置
      // FIXME 为啥两次才能过
      instanceDB.then(async db => {
        const tx = db.transaction('userList', 'readwrite');
        const index = tx.store.index('key');
        // 遍历 userID === source 的对象,将消息加进去
        for await (const cursor of index.iterate(key)) {
          const user = { ...cursor.value };
          user.preferences = { ...user.preferences, ...JSON.parse(message) };
          cursor.update(user);
        }
        await tx.done;
        broadCastMyMessage(db);
      });
      break;
    default:
      break;
  }
}, 100);

function storeMsg(packet: ClientboundMessagePacket) {
  const { content, source, target, timestamp } = packet;
  // 将 Long 型的时间转换成 number
  const _timestamp = timestamp.toNumber();
  // 没有对象的时候先创建
  instanceDB.then(async db => {
    const tx = db.transaction('userList', 'readwrite');
    const index = tx.store.index('key');
    // 遍历 userID === source 的对象,将消息加进去
    for await (const cursor of index.iterate(source)) {
      const user = { ...cursor.value };
      user.lastDate = _timestamp;
      user.message.push({
        content,
        _timestamp,
        target,
      });
      cursor.update(user);
    }
    await tx.done;

    broadCastMyMessage(db);
  });
}

function storeUser(packet: ClientboundStrangerPacket) {
  /*
    appKey 群组 ID g:10
    clientVendor 浏览器信息
    key 访客 ID s:xxxxx
    loaction 位置
    name 访客名字
    */
  // , appLogo, appName,
  const { appKey, avatar, clientVendor, key, location, name } = packet;
  // Add an user:
  instanceDB.then(async e => {
    const subjectList = await e.getAll('subjectList');
    const userSubject = subjectList.filter(
      item => item.subjectId === Number(appKey.split(':')[1]),
    )[0];
    if (userSubject) {
      e.getAllFromIndex('userList', 'key', key).then(data => {
        if (data.length === 0) {
          // 如果没查询到该用户把他储存到 DB 中
          e.add('userList', {
            appKey,
            appLogo: userSubject.subjectLogo,
            appName: userSubject.subjectName,
            avatar,
            clientVendor,
            key,
            location,
            name,
            message: [],
          });
        }
      });
    }
  });
}

function init(packet: ClientboundSyncSubjectsPacket) {
  //将群组添加到磁盘
  const { subjects } = packet;
  subjects.forEach(item => {
    const {
      subjectName,
      subjectLogo,
      subjectId,
      subjectDescription,
      createTime,
      ownerId,
      members,
    } = item;
    const _subjectId = Number(subjectId);
    const _createTime = Number(createTime);
    const _ownerId = Number(ownerId);
    // Add an subject:
    instanceDB.then(e => {
      e.getAllFromIndex('subjectList', 'subjectId', _subjectId).then(data => {
        if (data.length === 0) {
          // 如果没查询到该用户把他储存到 DB 中
          e.add('subjectList', {
            subjectId: _subjectId,
            subjectName,
            subjectLogo,
            subjectDescription,
            createTime: _createTime,
            ownerId: _ownerId,
          });
        }
      });
    });
  });

  const strangerListener: SessionListener = {
    packetReceived(event: PacketReceivedEvent) {
      const { packet } = event;
      if (packet instanceof ClientboundRecentServicesPacket) {
        // 历史用户列表
        packet.strangers.forEach(user => {
          storeUser(user);
        });
        // 收到用户列表后发送历史消息包
        cloudCourier.send(
          new ServerboundHistoryPacket('', Long.fromNumber(Date.now()), MESSAGE_MAX_COUNT),
        );
        // 获取个性化配置
        cloudCourier.send(
          new ServerboundRefreshChatListPacket(Long.fromNumber(Date.now()), MESSAGE_MAX_COUNT),
        );
      }
    },
  };
  const historyListener: SessionListener = {
    packetReceived(event: PacketReceivedEvent) {
      const { packet } = event;
      if (packet instanceof ClientboundHistoryPacket) {
        // 历史消息
        console.log('packet.messages', packet);

        packet.messages.forEach(historyPacket => {
          storeMsg(historyPacket);
        });
        cloudCourier.removeListener(strangerListener);
        cloudCourier.removeListener(historyListener);
      }
    },
  };
  cloudCourier.addListener(strangerListener);
  cloudCourier.addListener(historyListener);
  cloudCourier.send(
    new ServerboundQueryStrangerListPacket(
      Long.fromNumber(0),
      Long.fromNumber(Date.now()),
      MESSAGE_MAX_COUNT,
    ),
  );
}

cloudCourier
  .preAuth()
  .then(() => {
    cloudCourier.connect();
  })
  .then(() => {
    console.log('连接成功', cloudCourier.getState());
    broadCastChannel.postMessage({ type: 'WSState', state: cloudCourier.getState() });
  })
  .catch(e => {
    console.error('连接失败', e);
  });

cloudCourier.addListener({
  packetReceived(event: PacketReceivedEvent) {
    const { session, packet } = event;
    if (packet instanceof ClientboundPongPacket) {
      // 心跳包
      return;
    }
    console.log('packet', packet);

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
    } else if (packet instanceof ClientboundSyncSubjectsPacket) {
      // 收到群组的包，开始初始化
      init(packet);
    } else if (packet instanceof ClientboundStrangerPacket) {
      // 来访客了
      storeUser(packet);
    } else if (packet instanceof ClientboundServiceHistoryPacket) {
      // 查询历史服务
      broadCastChannel.postMessage({
        type: 'ClientboundServiceHistoryPacket',
        serviceHistory: packet.strangers.map(item => ({
          ...item,
          firstVisitTime: Number(item.firstVisitTime),
        })),
      });
    } else if (packet instanceof ClientboundRecentChatListPacket) {
      // 页面初始化时 初始化个性化配置
      const { chatList } = packet;
      instanceDB.then(async db => {
        const tx = db.transaction('userList', 'readwrite');
        const index = tx.store.index('key');
        chatList.forEach(async item => {
          // 遍历 userID === source 的对象,将消息加进去
          for await (const cursor of index.iterate(item.key)) {
            const user = { ...cursor.value };
            user.preferences = { ...user.preferences, ...JSON.parse(item.preferences) };
            cursor.update(user);
          }
        });
        await tx.done;
        broadCastMyMessage(db);
      });
    } else if (packet instanceof ClientboundChatListPacket) {
      // 个性化配置
      const { key, preferences } = packet;
      instanceDB.then(async db => {
        const tx = db.transaction('userList', 'readwrite');
        const index = tx.store.index('key');
        // 遍历 userID === source 的对象,将消息加进去
        for await (const cursor of index.iterate(key)) {
          const user = { ...cursor.value };
          user.preferences = { ...user.preferences, ...JSON.parse(preferences) };
          cursor.update(user);
        }
        await tx.done;
        broadCastMyMessage(db);
      });
    } else if (packet instanceof ClientboundDisconnectPacket) {
      console.log('断开链接packet', packet);
    }
  },
  packetSent(event: PacketSentEvent) {
    const { packet } = event;
    console.log('我发出去的packet', packet);
    if (packet instanceof ServerboundMessagePacket) {
      // TODO: 乐观更新
      const { content, target } = packet;
      const timestamp = Date.now();
      instanceDB.then(async e => {
        const ts = e.transaction('userList', 'readwrite');
        const index = ts.store.index('key');
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
        await ts.done;
        broadCastMyMessage(e);
      });
    } else if (packet instanceof ServerboundDeleteChatListPacket) {
      // 删除消息列 表
      // const { key } = packet
      // instanceDB.then(async (e) => {
      //   // e.put('userList', {}, key)
      //   e.delete
      // })
      broadCastChannel.postMessage({
        type: 'ServerboundDeleteChatListPacket_send',
        key: packet.key,
      });
    } else if (packet instanceof ServerboundAddChatListPacket) {
    }
  },
  packetError(event: PacketErrorEvent) {
    if (!event.supress) {
      console.error('解析包失败: ', event.cause);
    }
  },
  disconnected(event: DisconnectedEvent) {
    console.error('断开连接', event.reason, event.cause);
  },
});
