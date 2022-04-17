// import {
//   CloudCourier,
// } from '@cloud-courier/cloud-courier-lib';

// // 初始化客户端
// const cloudCourier: CloudCourier = new CloudCourier({
//   // 服务器域名
//   serverDomain: 'cccs.sunxinao.cn',
//   keepAliveInterval: 20, // 心跳间隔 s
// });
// // 预认证
// cloudCourier
//   .preAuth()
//   .then(() => cloudCourier.connect())
//   .then(() => {
//     console.log('连接成功');
//     packetReceived(event: PacketReceivedEvent) {
//       const { session } = event;
//       const { packet } = event;
//       if (packet instanceof ClientboundPongPacket) {
//         return;
//       }
//       // console.log('收到数据: ', packet);

//       // 使用 if 而不是使用 switch 是为了使用 instaceof 使其强制类型转换
//       if (packet instanceof ClientboundWelcomePacket) {
//         session.setState(ProtocolState.MESSAGING);
//       } else if (packet instanceof ClientboundMessagePacket) {
//         console.log('我收到消息 了packet: ', packet);
//         // todo 三个点没拷贝出来
//         // console.log("00000000000000",ref.current)
//         // const p = ref.current ;
//         // const newUserList = [...p];
//         // console.log("newUserList11111111111111",newUserList)

//         // const stranger = newUserList.find(item => item.key === packet.source);
//         // if (stranger) {
//         //   if (!stranger.messages) {
//         //     stranger.messages = [];
//         //   }
//         //   stranger.messages.push(packet);
//         // }
//         // console.log("newUserList",newUserList)
//         // setUserList(newUserList);
//         // console.log("___", userList);
//         // setMessageList(pre=>[...pre, packet]);
//       } else if (packet instanceof ClientboundSyncSubjectsPacket) {
//         // TODOFIX: 此处需要更新 subjectList,因为没有历史消息，暂时作为模拟消息
//         // setUserList(pre => [...pre, ...packet.subjects]);
//       } else if (packet instanceof ClientboundStrangerPacket) {
//         // 收到访客来访消息，并且分配给自己了
//         setUserList(pre => [...pre, packet]);
//       }
//       // 本地储存一个数组，点ID 之后把该ID的分配给他,还要有个当前ID, numbers
//     },
//   })
//   .catch(e => {
//     console.error('连接失败', e);
//   });

// // eslint-disable-next-line import/prefer-default-export
// export { cloudCourier };
