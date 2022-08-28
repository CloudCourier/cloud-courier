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
} from '@cloud-courier/cloud-courier-lib';
import { openDB } from 'idb/with-async-ittr';
import { debounce } from 'lodash';
import Long from 'long';
import { MESSAGE_MAX_COUNT } from '../const';

const instanceDB = openDB('cloudCourier', 1, {
  upgrade(db) {
    const userStore = db.createObjectStore('userList', {
      keyPath: 'id',
      autoIncrement: true,
    });
    userStore.createIndex('name', 'name');
    userStore.createIndex('target', 'target');
    userStore.createIndex('key', 'key');

    const subjectStore = db.createObjectStore('subjetList', {
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

const broadcastChannel = new BroadcastChannel('WebSocketChannel');
broadcastChannel.onmessage = debounce(e => {
  const { type, key, message } = e.data;
  if (type === 'sendRequest') {
    cloudCourier.send(new ServerboundMessagePacket(key, message));
  } else if (type === 'ClientboundStrangerPacket') {
    cloudCourier.send(
      new ServerboundQueryServiceHistoryPacket(
        Long.fromNumber(0),
        key,
        Long.fromNumber(Date.now()),
        MESSAGE_MAX_COUNT,
      ),
    );
  }
}, 100);

function storeMsg(packet: ClientboundMessagePacket) {
  let { content, source, target, timestamp } = packet;
  // 将 Long 型的时间转换成 number
  // @ts-igonre next-line
  const _timestamp = timestamp.toNumber();
  // 没有对象的时候先创建
  instanceDB.then(async db => {
    // TODO tx undefined

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

    db.getAll('userList').then(message => {
      broadcastChannel.postMessage({
        type: 'message',
        message,
      });
    });
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
  console.log('storeUser_____', packet);

  instanceDB.then(async e => {
    const subjetList = await e.getAll('subjetList');
    const userSubject = subjetList.filter(
      item => item.subjectId === Number(appKey.split(':')[1]),
    )[0];
    if (userSubject) {
      e.getAllFromIndex('userList', 'key', key).then(data => {
        console.log('data', data);
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
  cloudCourier.send(new ServerboundAddChatListPacket(key, JSON.stringify({})));
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
      e.getAllFromIndex('subjetList', 'subjectId', _subjectId).then(data => {
        if (data.length === 0) {
          // 如果没查询到该用户把他储存到 DB 中
          e.add('subjetList', {
            subjectId: _subjectId,
            subjectName,
            subjectLogo,
            subjectDescription,
            createTime: _createTime,
            _ownerId: ownerId,
          });
        }
      });
    });
  });

  let strangerListener: SessionListener = {
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
      }
    },
  };
  let historyListener: SessionListener = {
    packetReceived(event: PacketReceivedEvent) {
      const { packet } = event;
      if (packet instanceof ClientboundHistoryPacket) {
        // 历史消息
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
    broadcastChannel.postMessage({ type: 'WSState', state: cloudCourier.getState() });
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
      storeUser(packet);
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
  packetError(event: PacketErrorEvent) {
    if (!event.supress) {
      console.error('解析包失败: ', event.cause);
    }
  },
  disconnected(event: DisconnectedEvent) {
    console.error('断开连接', event.reason, event.cause);
  },
});
