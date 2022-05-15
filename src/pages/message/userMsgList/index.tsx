import Search from './search';
import styles from './index.scss';
import { useAppSelector } from '@/hooks/store';
import { choiceIdEle } from '@/utils/common';

function userMsgList({ setSearch, setUserId }) {
  const choiceUser = e => {
    const ele = choiceIdEle(e);
    Array.prototype.map.call(ele.parentElement.children, item => {
      item.className = item.className.replace('active', '');
    });
    ele.className = `${ele.className} active`;
    setUserId(ele.getAttribute('id'));
  };
  const message = useAppSelector(state => state.message.message);
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
          <div className={styles.feedCardDoneButton}>√</div>
        </div>
      </div>
    ));
  return (
    <div className={styles.messageContain}>
      <div className={styles.searchContain}>
        <Search setSearch={setSearch} />
      </div>
      <div className={styles.messageList}>{MsgList()}</div>
    </div>
  );
}
export default userMsgList;
