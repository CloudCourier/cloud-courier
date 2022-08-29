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
  preferences: any;
}

const VisitorInfo: FC<GroupSettingsProps> = ({ visitorKey, broadcastChannel, preferences }) => {
  const [avatarUrl, setAvatarUrl] = useState(''); // 头像
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    description: '',
  }); // 头像
  const [serviceHistory, setServiceHistory] = useState([]);
  useEffect(() => {
    broadcastChannel.postMessage({
      type: 'ClientboundStrangerPacket',
      key: visitorKey,
    });
    broadcastChannel.addEventListener('message', (event: MessageEvent<any>) => {
      const { serviceHistory, type } = event.data;
      if (type === 'ClientboundServiceHistoryPacket') {
        setServiceHistory(serviceHistory);
      }
    });
  }, []);
  const changeTOP = checked => {
    broadcastChannel.postMessage({
      type: 'ServerboundAddChatListPacket',
      key: visitorKey,
      message: checked ? JSON.stringify({ top: Date.now() }) : JSON.stringify({ top: false }),
    });
  };
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
                <Switch
                  defaultChecked={Boolean(preferences?.top)}
                  onChange={changeTOP}
                  aria-label="a switch for demo"
                ></Switch>
              }
            />
          </List>
        </TabPane>
      </Tabs>
      <Tabs type="line">
        <TabPane tab="访问历史" itemKey="1">
          <List
            dataSource={serviceHistory}
            renderItem={item => (
              <List.Item
                header={<Avatar>SE</Avatar>}
                main={
                  <div>
                    <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>
                      {item.name}
                    </span>
                    <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                      {item.location}
                    </p>
                    <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                      {item.clientVendor}
                    </p>
                    <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                      {Number(item.firstVisitTime)}
                    </p>
                  </div>
                }
              />
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default VisitorInfo;
