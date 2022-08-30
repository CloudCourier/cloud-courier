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
import { IconSearch, IconExit, IconEdit } from '@douyinfe/semi-icons';
import InviteModal from './InviteModal';
import EditModal from './EditModal';
import {
  exitSubject,
  deleteSubject,
  subjectDetail,
  updateSubject,
  removeMember,
} from '@/api/subjects';
import { useQuery } from 'react-query';
import type { User } from '@/types/user';
import { IllustrationNoResultDark, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import RemoveModal from './RemoveModal';
import styles from './index.scss';
interface GroupSettingsProps {
  groupId: number;
}

const GroupSettings: FC<GroupSettingsProps> = ({ groupId }) => {
  const [avatarUrl, setAvatarUrl] = useState(''); // 头像
  const [groupInfo, setGroupInfo] = useState({
    name: '',
    description: '',
  }); // 头像
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [removeUsername, setRemoveUserName] = useState('');
  const [removeUserId, setRemoveUserId] = useState(-1);

  const { data, isLoading, refetch } = useQuery('subjectDetail', () => subjectDetail(groupId));
  const user = getUserInfo();

  useEffect(() => {
    if (data) {
      const { logo, name, description } = data.data;
      setAvatarUrl(logo);
      setGroupInfo(() => ({
        name,
        description,
      }));
    }
  }, [data]);

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
  const removeHandle = () => {
    setRemoveLoading(true);
    removeMember(groupId, removeUserId)
      .then(data => {
        if (!data.data.error) {
          ToastSuccess(`移除${removeUsername}成功`);
          refetch();
        }
      })
      .finally(() => {
        setRemoveModalVisible(false);
        setRemoveLoading(false);
      });
  };
  const editHandle = () => {
    setEditLoading(true);
    updateSubject({ ...groupInfo, id: groupId })
      .then(data => {
        if (!data.data.error) {
          ToastSuccess('修改成功🚀');
          refetch();
        }
      })
      .finally(() => {
        setEditModalVisible(false);
        setEditLoading(false);
      });
  };
  if (isLoading) {
    return <Spin>loading</Spin>;
  }
  function MemberCardList(members: User[]) {
    if (search) {
      members = members.filter(item => item.username.indexOf(search) > -1);
    }
    if (members && members.length === 0) {
      return (
        <Empty
          image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
          darkModeImage={<IllustrationNoResultDark style={{ width: 150, height: 150 }} />}
          description={'搜索无结果'}
        />
      );
    }

    return (
      members &&
      members.map((item: User) => (
        <Col span={8} key={item.id}>
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
              title={item.username}
              avatar={<Avatar alt={item.username} size="default" src={item.avatar} />}
            />
            {item.id === data.data.owner_id ? (
              <Tag size="large" color="orange">
                创建者
              </Tag>
            ) : (
              <Button
                theme="light"
                type="danger"
                onClick={() => {
                  setRemoveModalVisible(true), setRemoveUserName(item.username);
                  setRemoveUserId(item.id);
                }}
              >
                移除
              </Button>
            )}
          </Card>
        </Col>
      ))
    );
  }
  return (
    <div className={styles.settingContainer}>
      <Space className={styles.groupInfoContainer}>
        <div className={styles.groupLogo}>
          <Meta avatar={<Upload setAvatarUrl={setAvatarUrl} avatarUrl={avatarUrl} />} />
        </div>
        <div className={styles.groupInfos}>
          <div className={styles.groupName}>
            {data.data && data.data.name}
            <Button
              type="primary"
              icon={<IconEdit />}
              aria-label="修改"
              onClick={() => setEditModalVisible(true)}
            />
          </div>
          <div className={styles.groupDes}>{data.data.description || '这个人很懒～'} </div>
        </div>
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
      <div className={styles.groupMembers}>
        <div className={styles.groupHeader}>
          <div className={styles.groupNum}>
            群成员 ({data.data.members && data.data.members.length})
          </div>
          <div className={styles.inviteMember}>
            <Button onClick={() => setInviteModalVisible(true)}>添加群成员</Button>
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
              {data.data && MemberCardList(data.data.members)}
            </Row>
          </div>
        </div>
      </div>
      <Button icon={<IconExit />} loading={loading} type="danger" block onClick={exit}>
        {data.data && user.id === data.data.owner_id ? '解散组织' : '退出组织'}
      </Button>
      <InviteModal
        visible={inviteModalVisible}
        groupId={groupId}
        onCancel={() => setInviteModalVisible(false)}
        footer={
          <Button type="primary" onClick={() => setInviteModalVisible(false)}>
            返回
          </Button>
        }
      />
      <EditModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={editHandle}
        groupInfo={groupInfo}
        setGroupInfo={setGroupInfo}
        confirmLoading={editLoading}
      />
      <RemoveModal
        visible={removeModalVisible}
        onCancel={() => setRemoveModalVisible(false)}
        onOk={removeHandle}
        username={removeUsername}
        confirmLoading={removeLoading}
      />
    </div>
  );
};
export default GroupSettings;
