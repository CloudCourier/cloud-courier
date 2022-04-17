import { IconSetting, IconUserCircle } from '@douyinfe/semi-icons';
import { Anchor, Tabs } from '@douyinfe/semi-ui';
import UserBaseInfo from '../components/UserBaseInfo/UserBaseInfo';
import styles from './index.scss';

const { TabPane } = Tabs;

export default function Center() {
  return (
    <div className={styles.centerContain}>
      <div className={styles.centerHeader}>个人中心</div>
      <UserBaseInfo />

      {/* <Tabs tabPosition="left" type="line" keepDOM={false}>
        <TabPane
          tab={
            <span>
              <IconUserCircle />
              个人资料
            </span>
          }
          itemKey="1"
        >
        </TabPane>
        <TabPane
          tab={
            <span>
              <IconSetting />
              账号设置
            </span>
          }
          itemKey="2"
        >
          2
        </TabPane>
      </Tabs> */}
    </div>
  );
}
