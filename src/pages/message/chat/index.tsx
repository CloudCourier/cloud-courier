import { SideSheet, TextArea } from '@douyinfe/semi-ui';
import { Picker } from 'emoji-mart-virtualized';
import dayjs from 'dayjs';
import 'emoji-mart-virtualized/css/emoji-mart.css';
import { IconMenu, IconFilpVertical, IconEmoji } from '@douyinfe/semi-icons';
import _ from 'lodash';
import { ToastInfo } from '@/utils/common';
import { useState, useRef } from 'react';
import i18 from './i18';
import styles from './index.scss';
import { useMemo, useEffect } from 'react';
import GroupSettings from './components/GroupSettings';

function Chat({ selectedUser }) {
  const [msg, setMsg] = useState('');
  const { key, message, appLogo, appName, clientVendor, name } = selectedUser;
  const scroll = useRef<HTMLDivElement>();
  const [showEmojiModal, setEmojiModal] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const InitList = useMemo(
    () =>
      message.map(item => (
        <div
          key={item.timestamp}
          className={`${styles.messageBubbleContainer} ${item.target === key ? styles.owner : ''} `}
        >
          <div className={styles.bubbleContainer}>
            <div className={styles.bubble}>
              <div>{item.content}</div>
              <div className={styles.bubbleTime}>{dayjs(item.timestamp).format('HH:mm:ss')}</div>
            </div>
          </div>
        </div>
      )),
    [message],
  );

  const sendMsg = () => {
    if (msg.trim() === '') {
      ToastInfo('请输入内容');
      setMsg('');
      return;
    }
    const broadcastChannel = new BroadcastChannel('WebSocketChannel');
    broadcastChannel.postMessage({
      type: 'sendRequest',
      id: key,
      message: msg,
    });
    setMsg('');
  };
  const searchEmoji = emojis => {
    setEmojiModal(false);
    setMsg(!_.isEmpty(msg) ? msg + emojis.native : emojis.native);
  };

  useEffect(() => {
    scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [message]);

  return (
    <div className={styles.maxContainer}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarNav}>
          <div className={styles.toolbarBack}>
            <div className={styles.avatar}>
              <img src={appLogo} alt="logo" />
            </div>
            {name}
          </div>
          <div className={styles.toolbarMenu}>
            <IconMenu className={styles.iconMenu} onClick={() => setSettingVisible(true)} />
          </div>
        </div>
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.msgContainer}>
          <div className={styles.msgPanel} ref={scroll}>
            {InitList}
          </div>
        </div>
        <div className={styles.sendContainer}>
          <div className={styles.sendTextarea}>
            <TextArea
              onChange={v => setMsg(v)}
              placeholder="请留言"
              className={styles.Textarea}
              value={msg}
              rows={1}
              autosize
              showClear
              onEnterPress={() => sendMsg()}
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
                  showSkinTones={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <SideSheet
        title="组织信息"
        visible={settingVisible}
        onCancel={() => setSettingVisible(false)}
        placement="right"
        width="100%"
      >
        <GroupSettings />
      </SideSheet>
    </div>
  );
}

export default Chat;
