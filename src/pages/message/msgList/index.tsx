import Search from './search';
import styles from './index.module.scss';

export default function MsgListD({ userList, setUserId }: any) {
  const choicUser = e => {
    let first = true;
    while (first === true ? !e.target.getAttribute('id') : !e.getAttribute('id')) {
      // 当第一次点击，且没有获取到ID的时候
      if (first) {
        // 第一次循环
        e = e.target.parentNode;
        first = false;
      } else {
        // 除了第一次循环，其他循环
        e = e.parentNode;
      }
    }
    if (first) {
      // 当第一次点击，就获取到ID的时候
      e = e.target;
    }
    setUserId(e.getAttribute('id'));
  };

  const MsgList = () =>
    userList.map((item: any) => (
      <div key={item.key} id={item.key} className={styles.feedCard} onClick={choicUser}>
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
    <div>
      <Search />
      <MsgList />
    </div>
  );
}
