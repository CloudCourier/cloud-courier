import Search from './search';
import { useAppSelector } from '@/hooks/store';
import { choiceIdEle } from '@/utils/common';
import { Divider, Tooltip } from '@douyinfe/semi-ui';
import { IconTick } from '@douyinfe/semi-icons';
import { BROAD_CAST_CHANNEL } from '@/const';
import styles from './index.scss';

function userMsgList({ setSearch, setUserId }) {
  const message = useAppSelector(state => state.message.message);
  const choiceUser = e => {
    const ele = choiceIdEle(e);
    // Array.prototype.map.call(ele.parentElement.children, item => {
    //   item.className = item.className.replace('active', '');
    // });
    // ele.className = `${ele.className} active`;
    setUserId(ele.getAttribute('id'));
  };
  const deleteChatList = key => {
    const BroadCastChannel = new BroadcastChannel(BROAD_CAST_CHANNEL);
    BroadCastChannel.postMessage({
      type: 'ServerboundDeleteChatListPacket',
      key,
    });
  };
  const choiceTopUser = e => {
    const ele = choiceIdEle(e);
    setUserId(ele.getAttribute('id'));
  };
  const MsgList = () =>
    message.map(item => (
      <div key={item.key} id={item.key} className={styles.feedCard} onClick={choiceUser}>
        <div className={styles.feedCardAvatar}>
          <div className={styles.avatar}>
            <img src={item.appLogo} alt="logo" />
          </div>
        </div>
        <div className={styles.feedCardMain}>
          <div className={styles.feedCardHeader}>
            <div className={styles.feedCardName}>
              <p className={styles.feedCardNameText}>{item.name}</p>
            </div>
            {/* (item.create_time) */}
            <div className={styles.feedCardHeaderTime}>22:45:56</div>
          </div>
          <div className={styles.feedMessagePreviewContainer}>
            <div className={styles.feedMessagePreviewTextOverflow}>
              <span className={styles.feedMessagePreviewContent}>{item.location}</span>
            </div>
          </div>
          <div className={styles.feedCardDoneButton}>
            <Tooltip content="完成">
              {' '}
              <IconTick className={styles.closeIcon} onClick={() => deleteChatList(item.key)} />
            </Tooltip>
          </div>
        </div>
      </div>
    ));
  const TopList = () => {
    const _topList = message
      .filter(item => item?.preferences?.top)
      .sort((a, b) => a.preferences.top - b.preferences.top);
    return _topList.map(item => (
      <>
        <div className={styles.feedCardAvatar} key={item.key} id={item.key} onClick={choiceTopUser}>
          <div className={styles.avatar}>
            <img src={item.appLogo} alt="logo" />
            <div className={styles.name}>{item.name}</div>
          </div>
        </div>
      </>
    ));
  };

  return (
    <div className={styles.messageContain}>
      <div className={styles.searchContain}>
        <Search setSearch={setSearch} />
      </div>
      <div className={styles.topList}>{TopList()}</div>
      <Divider />
      <div className={styles.messageList}>{MsgList()}</div>
    </div>
  );
}
export default userMsgList;
