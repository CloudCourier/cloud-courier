import { memo, useEffect, useRef, useState } from 'react';
import Chat from './chat';
import MsgList from './msgList';
import styles from './index.module.scss';
import { useContext } from 'react';
import { MsgContext } from '@/components/layout';

function Message() {
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);
  const usertemp = useContext(MsgContext);
  useEffect(() => {
    if (usertemp.length > 0) {
      setUserList(usertemp);
      console.log(usertemp);
      setMessageList(usertemp[0].message);
    }
  }, [usertemp]);
  return (
    <div className={styles.rootContain}>
      <div className={styles.msgList}>
        {/* // setUserId={setUserId} */}
        <MsgList userList={userList} />
      </div>
      <div className={styles.chatMessage}>
        <Chat messageList={messageList} setMessageList={setMessageList} cloudCourier />
      </div>
    </div>
  );
}
export default memo(Message);
