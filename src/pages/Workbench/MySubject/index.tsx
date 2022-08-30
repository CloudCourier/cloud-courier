import { Button, Space, Table, Avatar, SideSheet, Tag, Spin } from '@douyinfe/semi-ui';
import { useQuery } from 'react-query';
import { mySubjects } from '@/api/subjects';
import { IconGlobe } from '@douyinfe/semi-icons';
import { openProjectModal } from '@/store/subject.slice';
import { useAppDispatch } from '@/hooks/store';
import SubjectModal from './subjectModal';
import { getUserInfo, ToastError } from '@/utils/common';
import GroupSettings from '@/components/GroupSettings';
import { useState } from 'react';
import DeployModal from './deployModal';

function Tables() {
  const [settingVisible, setSettingVisible] = useState(false);
  const [deployModalVisible, setDeployModalVisible] = useState(false);
  const { id: userId } = getUserInfo();
  const { data, isLoading } = useQuery('mySubjects', mySubjects);
  const [groupId, setGroupId] = useState(-1);
  const [token, setToken] = useState(null);
  const dispatch = useAppDispatch();
  const goGroupSettings = (id: number) => {
    setGroupId(id);
    setSettingVisible(true);
  };
  const columns = [
    {
      title: '身份',
      dataIndex: 'owner_id',
      width: '20%',
      render: (owner_id: number) =>
        owner_id === userId ? (
          <Tag size="large" color="orange">
            创建者
          </Tag>
        ) : (
          <Tag color="green" size="large">
            组员
          </Tag>
        ),
    },
    {
      title: '图标',
      dataIndex: 'logo',
      width: '20%',
      render: (logo: string) => <Avatar src={logo} />,
    },

    {
      title: '组织名',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id: number, record) => (
        <>
          <Space>
            <Button onClick={() => goGroupSettings(id)}>详情</Button>
            <Button
              onClick={() => {
                setDeployModalVisible(true);
                setToken(record.token);
              }}
            >
              部署
            </Button>
          </Space>
        </>
      ),
    },
  ];

  if (isLoading) {
    return <Spin>loading</Spin>;
  }
  return (
    <>
      <Button type="primary" onClick={() => dispatch(openProjectModal('add'))} icon={<IconGlobe />}>
        新建组织
      </Button>
      <Table
        columns={columns}
        rowKey={(record: any) => record.id}
        dataSource={data?.data}
        // pagination={pagination}
        loading={isLoading}
        // onChange={handleTableChange}
      />
      <SubjectModal />
      <SideSheet
        title="组织信息"
        visible={settingVisible}
        onCancel={() => setSettingVisible(false)}
        placement="right"
        width="100%"
      >
        <GroupSettings groupId={groupId} />
      </SideSheet>
      <DeployModal
        token={token}
        width={800}
        height={700}
        onCancel={() => setDeployModalVisible(false)}
        visible={deployModalVisible}
      />
    </>
  );
}
export default Tables;
