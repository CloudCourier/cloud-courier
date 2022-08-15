import {
  Button,
  Space,
  Table,
  Avatar,
  Tooltip,
  Popconfirm,
  SideSheet,
  Tag,
} from '@douyinfe/semi-ui';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { delMySubject, getMembers, joined } from '@/api/subjects';
import { IconGlobe } from '@douyinfe/semi-icons';
import { openProjectModal, setSubjectId, setToken } from '@/store/subject.slice';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import SubjectModal from './subjectModal';
import { getUserInfo, ToastError } from '@/utils/common';
import GroupSettings from '@/pages/Message/Chat/components/GroupSettings';
import { useState } from 'react';

function Tables() {
  const [settingVisible, setSettingVisible] = useState(false);
  const { id: userId } = getUserInfo();
  const { data, isLoading } = useQuery('joined', joined);
  // const [pagination, setpagination] = useState({
  //   current: 1,
  //   pageSize: 10,
  //   total: 10,
  // })
  // const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  //   userList(pagination.current, pagination.pageSize)
  // }
  // const userList = (current: number, pageSize: number) => {

  // }
  const dispatch = useAppDispatch();

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
      render: (id: number, object: { token: string }) => (
        <Space>
          <Button onClick={() => setSettingVisible(true)} id={`${id}`} attr-token={object.token}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

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
        <GroupSettings />
      </SideSheet>
    </>
  );
}
export default Tables;
