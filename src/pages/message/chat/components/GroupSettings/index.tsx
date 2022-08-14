import Upload from '@/components/upload';
import { getUserInfo } from '@/utils/common';
import { Avatar, Button, Card, Col, Input, Row, Space } from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { useEffect, useState } from 'react';
import { IconSearch } from '@douyinfe/semi-icons';
import styles from './index.scss';

const GroupSettings = () => {
  const [avatarUrl, setAvatarUrl] = useState(''); // 头像

  useEffect(() => {
    const user = getUserInfo();
    if (!user.avatar) {
      user.then(data => {
        setAvatarUrl(data.avatar);
      });
      return;
    }
    setAvatarUrl(user.avatar);
  });
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
            <Button>添加群成员</Button>
          </div>
        </div>
        <div className={styles.membersListContiner}>
          <div className={styles.membersList}>
            <Input prefix={<IconSearch />} placeholder="搜索群成员" showClear></Input>
            <Row  gutter={[16,16]} style={{marginTop:'20px'}}>
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
    </div>
  );
};
export default GroupSettings;
