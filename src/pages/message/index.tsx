import { memo, useEffect, useRef, useState } from 'react';
import Chat from './chat';
import MsgList from './msgList';
import styles from './index.module.scss';
import { useContext } from 'react';
import { MsgContext } from '@/components/layout';
import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';

function Message() {
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState('');
  const usertemp = useContext(MsgContext);
  useEffect(() => {
    if (usertemp.length > 0) {
      setUserList(usertemp);
      console.log(usertemp);
    }
  }, [usertemp]);
  useEffect(() => {
    if (userId !== '') {
      const choreUser = usertemp.filter(item => item.key === userId);
      // 将选择用户的消息列表传递给组件，进行展示
      setMessageList(choreUser[0].message);
    }
  }, [userId]);
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
        <MsgList userList={userList} setUserId={setUserId} />
      </div>
      <div className={styles.chatMessage}>
        {messageList.length > 0 ? (
          <Chat messageList={messageList} setMessageList={setMessageList} cloudCourier />
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
