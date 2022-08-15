import UserBaseInfo from './components/UserBaseInfo';
import styles from './index.scss';

export default function Center() {
  return (
    <div className={styles.centerContain}>
      <UserBaseInfo />
    </div>
  );
}
