import Upload from '@/components/Upload';
import { getUserInfo, ToastSuccess } from '@/utils/common';
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Input,
  List,
  Row,
  Space,
  Spin,
  Switch,
  TabPane,
  Tabs,
  Tag,
  Divider,
  Modal,
} from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { FC, useEffect, useState } from 'react';
import { IconEdit } from '@douyinfe/semi-icons';

import styles from './index.scss';

interface GroupSettingsProps {
  visitorKey: number;
  broadcastChannel: BroadcastChannel;
}

const VisitorInfo: FC<GroupSettingsProps> = ({ visitorKey, broadcastChannel }) => {
  const [avatarUrl, setAvatarUrl] = useState(''); // 头像
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    description: '',
  }); // 头像

  useEffect(() => {
    broadcastChannel.postMessage({
      type: 'ClientboundStrangerPacket',
      key: visitorKey,
    });
  }, []);

  return (
    <div className={styles.infoContainer}>
      <Space className={styles.visitorInfoContainer}>
        <div className={styles.visitorLogo}>
          <Meta avatar={<Upload setAvatarUrl={setAvatarUrl} avatarUrl={avatarUrl} />} />
        </div>
        {/* <div className={styles.visitorInfos}>
                    <div className={styles.visitorName}>
                        {data.data && data.data.name}
                        <Button
                            type="primary"
                            icon={<IconEdit />}
                            aria-label="修改"
                            onClick={() => setEditModalVisible(true)}
                        />
                    </div>
                    <div className={styles.visitorDes}>{data.data.description || '这个人很懒～'} </div>
                </div> */}
      </Space>
      <Tabs type="line" style={{ marginTop: '20px' }}>
        <TabPane tab="会话设置" itemKey="1">
          <List>
            <List.Item
              header={<h4 style={{ fontWeight: 600 }}>置顶</h4>}
              extra={
                <Switch onChange={(v, e) => console.log(v)} aria-label="a switch for demo"></Switch>
              }
            />
          </List>
          <Divider margin="12px" />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default VisitorInfo;
