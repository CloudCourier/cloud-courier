import userCenterRefreshJwtSecretSufApi from '@/api/userCenter/userCenterRefreshJwtSecretSufApi';
import { execConfirm, ToastSuccess } from '@/util/CommonUtil';
import { Button, List, Typography } from '@douyinfe/semi-ui';
import { useState } from 'react';
import DelAccount from '../DelAccount/DelAccount';
import LoginRecord from '../LoginRecord/LoginRecord';
import UpdateEmail from '../../../workbench/user/components/UpdateEmail/UpdateEmail';
import UpdatePassword from '../UpdatePassword/UpdatePassword';

export default function AccountSettings() {
  const [delAccountModalVisible, setDelAccountModalVisible] = useState(false); // 账号注销
  const [updatePasswordModalVisible, setUpdatePasswordModalVisible] = useState(false); // 修改密码
  const [updateEmailModalVisible, setUpdateEmailModalVisible] = useState(false); // 修改邮箱
  const [loginRecordModalVisible, setLoginRecordModalVisible] = useState(false); // 登录记录

  return (
    <>
      <List className="w-680 m-l-20 m-t-20">
        <List.Item
          main="密码"
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
          main="邮箱"
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
        <List.Item
          main={
            <div className="flex-c">
              刷新令牌
              <Typography.Text type="tertiary">
                刷新之后，执行任意操作，都会要求重新登录，用于：不修改密码，退出所有登录
              </Typography.Text>
            </div>
          }
          extra={
            <Button
              theme="borderless"
              onClick={() => {
                execConfirm(() => {
                  return userCenterRefreshJwtSecretSufApi().then(({ data }) => {
                    ToastSuccess(data.msg);
                  });
                });
              }}
            >
              执行刷新
            </Button>
          }
        />
        <List.Item
          main="登录记录"
          extra={
            <Button
              theme="borderless"
              onClick={() => {
                setLoginRecordModalVisible(true);
              }}
            >
              查看记录
            </Button>
          }
        />
        <List.Item
          main="账号注销"
          extra={
            <Button
              type="danger"
              theme="borderless"
              onClick={() => {
                setDelAccountModalVisible(true);
              }}
            >
              立即注销
            </Button>
          }
        />
      </List>

      <UpdatePassword
        modalVisible={updatePasswordModalVisible}
        setModalVisible={setUpdatePasswordModalVisible}
      />
      <UpdateEmail
        modalVisible={updateEmailModalVisible}
        setModalVisible={setUpdateEmailModalVisible}
      />
      <LoginRecord
        modalVisible={loginRecordModalVisible}
        setModalVisible={setLoginRecordModalVisible}
      />
      <DelAccount
        modalVisible={delAccountModalVisible}
        setModalVisible={setDelAccountModalVisible}
      />
    </>
  );
}
