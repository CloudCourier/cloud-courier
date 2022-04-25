import { useRef, useEffect, useState } from 'react';
import Chat from './chat';
import UserMsgList from './userMsgList';
import styles from './index.scss';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';
import { useAppSelector } from '@/hooks/store';

function Message() {
  const [selectedUser, setSelectedUser] = useState('none');
  const [userId, setUserId] = useState('');
  const userMessage = useAppSelector(state => state.message.message);
  const srollRef = useRef<HTMLDivElement>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (userId !== '') {
      const tempUser = userMessage.filter(item => item.key === userId);
      // 将选择用户的消息列表传递给组件，进行展示
      setSelectedUser(tempUser[0]);
    }
    // 通过监听消息列表的变化和用户的切换，来更新消息列表
  }, [userMessage, userId]);
  useEffect(() => {
    if (search === '') return;
    const index = userMessage.findIndex(item => item.name === search);
    const searchEleArray = srollRef.current.children[0].children[1].children;
    Array.prototype.map.call(searchEleArray, item => {
      item.className = item.className.replace('active', '');
    });
    searchEleArray[index].className = `${searchEleArray[index].className} active`;
    srollRef.current.scrollTo({
      top: index * 60,
      behavior: 'smooth',
    });
    setUserId(searchEleArray[index].getAttribute('id'));
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
