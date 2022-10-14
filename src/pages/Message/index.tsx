import { useRef, useEffect, useState } from 'react';
import Chat from './Chat';
import UserMsgList from './UserMsgList';
import styles from './index.scss';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import { useAppSelector } from '@/hooks/store';
import { useIdle } from 'react-use';
import { BROAD_CAST_CHANNEL } from '@/consts';
import { useParams } from 'react-router';

function Message(props) {
  const [selectedUser, setSelectedUser] = useState('none');
  const [userId, setUserId] = useState('');
  const userMessage = useAppSelector(state => state.message.message);
  const lastMessageTime = useAppSelector(state => state.message.lastMessageTime);
  const srollRef = useRef<HTMLDivElement>();
  const [search, setSearch] = useState('');
  const broadCastChannel = new BroadcastChannel(BROAD_CAST_CHANNEL);
  console.log(props);
  const locateUser = (attribute: string, condition) => {
    const tempUser = userMessage.filter(item => item[attribute] === condition);
    // 将选择用户的消息列表传递给组件，进行展示
    setSelectedUser(tempUser[0]);
    const index = userMessage.findIndex(item => item[attribute] === condition);
    const EleArray = Array.prototype.slice.call(
      srollRef.current.children[0].children[3].children,
      1,
    );

    Array.prototype.map.call(EleArray, item => {
      item.className = item.className.replace('active', '');
    });
    EleArray[index].className = `${EleArray[index].className} active`;
    srollRef.current.scrollTo({
      top: index * 60,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (userId !== '') {
      const tempUser = userMessage.filter(item => item['key'] === userId);
      // 将选择用户的消息列表传递给组件，进行展示
      setSelectedUser(tempUser[0]);
    }
  }, [lastMessageTime]);

  useEffect(() => {
    if (userId !== '') {
      setSearch('');
      locateUser('key', userId);
      broadCastChannel.postMessage({
        type: 'ServerboundAddChatListPacket',
        key: userId,
        message: JSON.stringify({ lastTime: Date.now() }),
      });
    }
    // 通过监听消息列表的变化和用户的切换，来更新消息列表
    // 更新最后时间
  }, [userId]);

  useEffect(() => {
    // 搜索用户，更新选中的用户
    if (search === '') return;

    const index = userMessage.findIndex(item => item.key === search);
    const searchEleArray = srollRef.current.children[0].children[3].children;
    const _searchEleArray = Array.prototype.slice.call(searchEleArray, 1);
    Array.prototype.map.call(searchEleArray, item => {
      item.className = item.className.replace('active', '');
    });
    _searchEleArray[index].className = `${_searchEleArray[index].className} active`;
    srollRef.current.scrollTo({
      top: index * 60,
      behavior: 'smooth',
    });
    setUserId(_searchEleArray[index].getAttribute('id'));
  }, [search]);

  const emptyStyle = {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #e9e9e9',
  };

  return (
    <div className={styles.rootContain}>
      <div className={styles.msgList} ref={srollRef}>
        <UserMsgList setUserId={setUserId} setSearch={setSearch} />
      </div>
      <div className={styles.chatMessage}>
        {selectedUser !== 'none' ? (
          <Chat selectedUser={selectedUser} />
        ) : (
          <Empty
            image={<IllustrationNoContent />}
            darkModeImage={<IllustrationNoContentDark />}
            style={emptyStyle}
          />
        )}
      </div>
    </div>
  );
}
export default Message;
