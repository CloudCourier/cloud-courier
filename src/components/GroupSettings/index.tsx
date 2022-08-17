import Upload from '@/components/Upload';
import { getUserInfo, ToastSuccess } from '@/utils/common';
import { Avatar, Button, Card, Col, Input, Row, Space, Spin, Tag } from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { FC, useEffect, useState } from 'react';
import { IconSearch, IconExit } from '@douyinfe/semi-icons';
import InviteModal from '../InviteModal';
import { exitSubject, deleteSubject, subjectDetail } from '@/api/subjects';
import styles from './index.scss';
import { useQuery } from 'react-query';
import type { User } from '@/types/user';

interface GroupSettingsProps {
  groupId: number;
}

const GroupSettings: FC<GroupSettingsProps> = ({ groupId }) => {
  const [avatarUrl, setAvatarUrl] = useState(''); // 头像
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const modalClose = () => {
    console.log('close');
  };
  const { data, isLoading } = useQuery('invitations', () => subjectDetail(groupId));
  const user = getUserInfo();
  useEffect(() => {
    if (data) {
      setAvatarUrl(data.data.logo);
    }
  }, [data]);

  if (isLoading) {
    return <Spin>loading</Spin>;
  }

  const exit = () => {
    setLoading(true);
    if (user.id === data.data.owner_id) {
      //解散组织
      deleteSubject(groupId)
        .then(() => {
          ToastSuccess('操作成功');
          // TODO: 待优化
          window.location.reload();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      //离开组织
      exitSubject(groupId)
        .then(() => {
          ToastSuccess('操作成功');
          // TODO: 待优化
          window.location.reload();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  function MemberCardList(members: User[]) {
    if (search) {
      members = members.filter(item => item.name.indexOf(search) > -1);
    }
    return members.map((item: User) => (
      <Col span={8}>
        {/* TODO：个人 card 预览 */}
        <Card
          shadows="hover"
          style={{ maxWidth: 360 }}
          bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Meta
            title={item.name}
            avatar={<Avatar alt={item.name} size="default" src={item.logo} />}
          />
          {item.id === data.data.owner_id ? (
            <Tag size="large" color="orange">
              创建者
            </Tag>
          ) : (
            <Button theme="light" type="danger">
              移除
            </Button>
          )}
        </Card>
      </Col>
    ));
  }
  return (
    <div className={styles.settingContainer}>
      <Space className={styles.groupInfoContainer}>
        <div className={styles.groupLogo}>
          <Meta avatar={<Upload setAvatarUrl={setAvatarUrl} avatarUrl={avatarUrl} />} />
        </div>
        <div className={styles.groupInfos}>
          <div className={styles.groupName}>{data.data.name}</div>
          <div className={styles.groupDes}>暂无群描述</div>
        </div>
      </Space>
      <div>会话设置</div>
      <div className={styles.groupMembers}>
        <div className={styles.groupHeader}>
          <div className={styles.groupNum}>群成员 ({data.data.members.length})</div>
          <div className={styles.inviteMember}>
            <Button onClick={() => setModalVisible(true)}>添加群成员</Button>
          </div>
        </div>
        <div className={styles.membersListContiner}>
          <div className={styles.membersList}>
            <Input
              prefix={<IconSearch />}
              placeholder="搜索群成员"
              showClear
              onChange={setSearch}
            ></Input>
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              {MemberCardList(data.data.members)}
            </Row>
          </div>
        </div>
      </div>
      <Button icon={<IconExit />} loading={loading} type="danger" block onClick={exit}>
        {user.id === data.data.owner_id ? '解散组织' : '退出组织'}
      </Button>
      <InviteModal
        visible={modalVisible}
        groupId={groupId}
        onCancel={() => setModalVisible(false)}
        footer={
          <Button type="primary" onClick={() => setModalVisible(false)}>
            返回
          </Button>
        }
      />
    </div>
  );
};
export default GroupSettings;
