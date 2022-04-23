import { memo, useEffect, useRef, useState } from 'react';
import Chat from './chat';
import UserMsgList from './userMsgList';
import styles from './index.scss';
import { useContext } from 'react';
import { MsgContext } from '@/components/layout';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';

function Message() {
  const [selectedUser, setSelectedUser] = useState('none');
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState('');
  const usertemp = useContext(MsgContext);
  useEffect(() => {
    if (usertemp.length > 0) {
      setUserList(usertemp);
    }
    // 消息列表更新的时候才去更新用户列表
  }, [usertemp]);
  useEffect(() => {
    if (userId !== '') {
      const tempUser = usertemp.filter(item => item.key === userId);
      // 将选择用户的消息列表传递给组件，进行展示
      setSelectedUser(tempUser[0]);
    }
    // 通过监听消息列表的变化和用户的切换，来更新消息列表
  }, [usertemp, userId]);
  const emptyStyle = {
    // padding: 30,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #e9e9e9',
  };

  return (
    <div className={styles.rootContain}>
      <div className={styles.msgList}>
        <UserMsgList userList={userList} setUserId={setUserId} />
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
export default memo(Message);
