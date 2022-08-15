import Upload from '@/components/Upload';
import { getUserInfo, ToastSuccess } from '@/utils/common';
import { Avatar, Button, Card, Col, Input, Row, Space } from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { FC, useEffect, useState } from 'react';
import { IconSearch, IconExit } from '@douyinfe/semi-icons';
import InviteModal from '../InviteModal';
import { exitSubject, deleteSubject } from '@/api/subjects';
import styles from './index.scss';

interface GroupSettingsProps {
  groupId: number;
}

const GroupSettings: FC<GroupSettingsProps> = ({ groupId }) => {
  const [avatarUrl, setAvatarUrl] = useState(''); // 头像
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const modalClose = () => {
    console.log('close');
  };
  useEffect(() => {
    console.log('groupId', groupId);

    const user = getUserInfo();
    if (!user.avatar) {
      user.then(data => {
        setAvatarUrl(data.avatar);
      });
      return;
    }
    setAvatarUrl(user.avatar);
  });
  const exit = () => {
    setLoading(true);
    // TODO 判断是退群还是删除 根据 owner_id
    deleteSubject(groupId)
      .then(() => {
        ToastSuccess('操作成功');
        // TODO: 待优化
        window.location.reload();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.settingContainer}>
      <Space className={styles.groupInfoContainer}>
        <div className={styles.groupLogo}>
          <Meta avatar={<Upload setAvatarUrl={setAvatarUrl} avatarUrl={avatarUrl} />} />
        </div>
        <div className={styles.groupInfos}>
          <div className={styles.groupName}>云信客服</div>
          <div className={styles.groupDes}>暂无群描述</div>
        </div>
      </Space>
      <div>会话设置</div>
      <div className={styles.groupMembers}>
        <div className={styles.groupHeader}>
          <div className={styles.groupNum}>群成员 (2)</div>
          <div className={styles.inviteMember}>
            <Button onClick={() => setModalVisible(true)}>添加群成员</Button>
          </div>
        </div>
        <div className={styles.membersListContiner}>
          <div className={styles.membersList}>
            <Input prefix={<IconSearch />} placeholder="搜索群成员" showClear></Input>
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              <Col span={8}>
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
                    title="Semi Doc"
                    avatar={
                      <Avatar
                        alt="Card meta img"
                        size="default"
                        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
                      />
                    }
                  />
                  <Button>shanchu</Button>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{ maxWidth: 360 }}
                  bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Meta
                    title="Semi Doc"
                    avatar={
                      <Avatar
                        alt="Card meta img"
                        size="default"
                        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
                      />
                    }
                  />
                  <Button>shanchu</Button>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{ maxWidth: 360 }}
                  bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Meta
                    title="Semi Doc"
                    avatar={
                      <Avatar
                        alt="Card meta img"
                        size="default"
                        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
                      />
                    }
                  />
                  <Button>shanchu</Button>
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  style={{ maxWidth: 360 }}
                  bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Meta
                    title="Semi Doc"
                    avatar={
                      <Avatar
                        alt="Card meta img"
                        size="default"
                        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
                      />
                    }
                  />
                  <Button>shanchu</Button>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Button icon={<IconExit />} loading={loading} type="danger" block onClick={exit}>
        退出组织
      </Button>
      <InviteModal
        visible={modalVisible}
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
