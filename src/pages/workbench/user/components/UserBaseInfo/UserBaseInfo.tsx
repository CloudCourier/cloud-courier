import { getUserInfo } from '@/utils/common';
import { Button, Card, List } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import UpdateEmail from '../UpdateEmail/UpdateEmail';
import UpdatePassword from '../UpdatePassword/UpdatePassword';
import Upload from '@/components/upload';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import UpdateName from '../updateName';

export default function AccountSettings() {
  const [updateNameModalVisible, setUpdateNameModalVisible] = useState(false); // 修改邮箱
  const [updatePasswordModalVisible, setUpdatePasswordModalVisible] = useState(false); // 修改密码
  const [updateEmailModalVisible, setUpdateEmailModalVisible] = useState(false); // 修改邮箱
  const [avatarUrl, setAvatarUrl] = useState(''); // 头像
  const [userName, setUserName] = useState(''); // 用户名

  useEffect(() => {
    const user = getUserInfo();
    if (!user.avatar) {
      user.then(data => {
        setAvatarUrl(data.avatar);
        setUserName(data.username);
      });
      return;
    }
    setAvatarUrl(user.avatar);
    setUserName(user.username);
  });

  return (
    <div style={{ margin: '20px' }}>
      <Card
        style={{ maxWidth: 360 }}
        bodyStyle={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Meta
          title={userName}
          avatar={<Upload setAvatarUrl={setAvatarUrl} avatarUrl={avatarUrl} />}
        />
        <Button
          theme="borderless"
          onClick={() => {
            setUpdateNameModalVisible(true);
          }}
        >
          修改昵称
        </Button>
      </Card>
      <div style={{ padding: 12, border: '1px solid var(--semi-color-border)', width: '360px' }}>
        <List>
          <List.Item
            main={
              <div>
                <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>密码</span>
              </div>
            }
            extra={
              <Button
                theme="borderless"
                onClick={() => {
                  setUpdatePasswordModalVisible(true);
                }}
              >
                修改密码
              </Button>
            }
          />
          <List.Item
            main={
              <div>
                <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>手机</span>
                <p>请完善手机</p>
              </div>
            }
            extra={
              <Button
                theme="borderless"
                onClick={() => {
                  setUpdateEmailModalVisible(true);
                }}
              >
                修改手机
              </Button>
            }
          />
          <List.Item
            main={
              <div>
                <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>邮箱</span>
                <p>邮箱为:1561314334@qq.com</p>
              </div>
            }
            extra={
              <Button
                theme="borderless"
                onClick={() => {
                  setUpdateEmailModalVisible(true);
                }}
              >
                修改邮箱
              </Button>
            }
          />
        </List>
      </div>
      <UpdateName
        modalVisible={updateNameModalVisible}
        setModalVisible={setUpdateNameModalVisible}
      />
      <UpdatePassword
        modalVisible={updatePasswordModalVisible}
        setModalVisible={setUpdatePasswordModalVisible}
      />
      <UpdateEmail
        modalVisible={updateEmailModalVisible}
        setModalVisible={setUpdateEmailModalVisible}
      />
    </div>
  );
}
