import { memo, useEffect, useRef, useState } from 'react';
import Chat from './chat';
import MsgList from './msgList';
import styles from './index.scss';

function Message() {
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([]);

  // const ref= useRef();
  // const [userId, setUserId] = useState('');

  // useEffect(() => {
  //   ref.current = userList;
  // },[userList]);

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
