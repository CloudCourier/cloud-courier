import { Card } from '@douyinfe/semi-ui';
import styles from './index.scss';

export default function LoginRegisterBase(props) {
  return (
    <div className={styles.pureTop}>
      <Card shadows="always">
        <h2 className={styles.cardH2}>云信客服 | {props.name}</h2>
        {props.children}
      </Card>
    </div>
  );
}
