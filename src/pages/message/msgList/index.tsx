// import { joined } from '@/api/subjects';
// import { useQuery } from 'react-query';
import Search from './search';
import styles from './index.scss';

export default function MsgListD({ userList, setUserId }: any) {
  console.log('userList: ', userList);
  const choicUser = (e: any) => {
    // console.log(e.target);
    // console.log(e.target.getAttribute('id'));
    setUserId(e.target.getAttribute('id'));
  };
  const MsgList = () =>
    userList.map((item: any) => (
      <div key={item.key} className={styles.feedCard}>
        <div className={styles.feedCardAvatar}>
          <div className={styles.avatar}>
            <img
              id={item.key}
              onClick={choicUser}
              onKeyDownCapture={choicUser}
              src={item.appLogo}
              alt="logo"
            />
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
