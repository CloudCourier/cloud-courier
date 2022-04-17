import {
  CloudCourier,
  ClientboundPongPacket,
  ClientboundWelcomePacket,
  ClientboundMessagePacket,
  ProtocolState,
  ClientboundOnlineMemberPacket,
  ClientboundStrangerPacket,
} from '@cloud-courier/cloud-courier-lib';
// // const { CloudCourier } = require('@cloud-courier/cloud-courier-lib');
// // importScripts("@cloud-courier/cloud-courier-lib")
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
      const { content, source, target } = packet;
      broadcastChannel.postMessage({
        type: 'message',
        message: {
          content,
          source,
          target,
        },
      });
      console.log('我收到消息 了packet: ', packet);
    } else if (packet instanceof ClientboundStrangerPacket) {
      const { appKey, appLogo, target } = packet;

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
};
