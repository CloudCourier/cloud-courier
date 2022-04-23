import CFooter from '@/components/CFooter/CFooter';
import { Card } from '@douyinfe/semi-ui';
import { useEffect } from 'react';
import styles from './LoginRegisterBase.scss';

export default function LoginRegisterBase(props) {
  // useEffect(() => {
  //   removeAppLoading() // 移除 appLoading
  // }, [])

  return (
    <div className={styles.pureTop}>
      <Card shadows="always">
        <h2 className={styles.cardH2}>云信客服 | {props.name}</h2>
        {props.children}
      </Card>
      <CFooter />
    </div>
  );
}
