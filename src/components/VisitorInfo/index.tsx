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
import { openDB } from 'idb';
import dayjs from 'dayjs';

interface GroupSettingsProps {
  visitorKey: number;
  broadcastChannel: BroadcastChannel;
  preferences: any;
  appLogo: string;
  name: string;
}

const VisitorInfo: FC<GroupSettingsProps> = ({
  visitorKey,
  broadcastChannel,
  preferences,
  appLogo,
  name,
}) => {
  const [serviceHistory, setServiceHistory] = useState([]);
  useEffect(() => {
    // 查询历史服务
    broadcastChannel.postMessage({
      type: 'ServerboundQueryServiceHistoryPacket',
      key: visitorKey,
    });
    broadcastChannel.addEventListener('message', (event: MessageEvent<any>) => {
      const { serviceHistory, type } = event.data;
      if (type === 'ClientboundServiceHistoryPacket') {
        openDB('cloudCourier').then(db => {
          db.getAll('subjectList')
            .then(res => {
              return Promise.resolve(res);
            })
            .then(subjectList => {
              const _serviceHistory = serviceHistory.map(history => {
                const subjectId = Number(history.appKey.split(':')[1]);
                const result = subjectList.filter(item => item.subjectId === subjectId)[0];
                return {
                  ...history,
                  ...result,
                };
              });
              setServiceHistory(_serviceHistory);
            });
        });
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
          <Meta avatar={<Avatar src={appLogo} />} title={name} />
        </div>
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
                header={
                  <>
                    <Avatar src={item.subjectLogo} />
                    <h2>{item.subjectName}</h2>
                  </>
                }
                key={item.key}
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
                      {/* FIXME NAN */}
                      {dayjs(item.firstVisitTime).format('YYYY-MM-DD HH:mm:ss')}
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
