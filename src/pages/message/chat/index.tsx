import { TextArea } from '@douyinfe/semi-ui';
import { Picker } from 'emoji-mart-virtualized';
// import moment from 'moment';
import 'emoji-mart-virtualized/css/emoji-mart.css';
import { IconMenu, IconFilpVertical, IconEmoji } from '@douyinfe/semi-icons';
import _ from 'lodash';
import { useState, useRef } from 'react';

import i18 from './i18';
import styles from './index.module.scss';
import { memo } from 'react';
import { useEffect } from 'react';

function Chat({ messageList, userId }: any) {
  //  time: moment(new Date()).format('HH:mm:ss'),
  const scroll = useRef<HTMLDivElement>();
  const [msg, setMsg] = useState('');
  const [showEmojiModal, setEmojiModal] = useState(false);
  const InitList = messageList.map((item: any) => (
    // TODO
    <div key={Math.random()} className={styles.messageBubbleContainer}>
      <div className={styles.bubbleContainer}>
        <div className={styles.bubble}>
          <div>{item.content}</div>
          <div className={styles.bubbleTime}>{item.content}</div>
        </div>
      </div>
    </div>
  ));
  useEffect(() => {
    scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messageList]);

  function sendMsg() {
    broadcastChannel.postMessage({
      type: 'sendRequest',
      id: userId,
      message: 'hello',
    });
  }
  const broadcastChannel = new BroadcastChannel('WebSocketChannel');

  function searchEmoji(emojis: any) {
    setEmojiModal(false);
    setMsg(!_.isEmpty(msg) ? msg + emojis.native : emojis.native);
  }

  const usename = 'bowlingQ';
  const imgUrl = 'https://avatars.githubusercontent.com/u/7843281?s=40&v=4';
  return (
    <div className={styles.maxContainer}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarNav}>
          <div className={styles.toolbarBack}>
            <div className={styles.avatar}>
              <img src={imgUrl} alt="logo" />
            </div>
            {usename}
          </div>
          <div className={styles.toolbarMenu}>
            <IconMenu className={styles.iconMenu} />
          </div>
        </div>
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.msgContainer}>
          <div className={styles.msgPanel} ref={scroll}>
            <div>{InitList}</div>
          </div>
        </div>
        <div className={styles.sendContainer}>
          <div className={styles.sendTextarea}>
            <TextArea
              placeholder="请留言"
              className={styles.Textarea}
              value={msg}
              onChange={v => setMsg(v)}
            />
          </div>
          <div className={styles.funcContainer}>
            <IconFilpVertical className={styles.iconSend} onClick={() => sendMsg()} />
            <IconEmoji
              className={styles.iconEmoji}
              onClick={() => setEmojiModal(!showEmojiModal)}
            />

            <div className={styles.emojiContainer}>
              {showEmojiModal && (
                <Picker
                  set="twitter"
                  showPreview={false}
                  onClick={(emoji: any) => searchEmoji(emoji)}
                  i18n={i18}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Chat);
