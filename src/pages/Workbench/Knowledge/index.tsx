import { Button, Space, Table, Avatar, SideSheet, Tag, Spin } from '@douyinfe/semi-ui';
import { IconTop } from '@douyinfe/semi-icons';
import { useQuery } from 'react-query';
import { joined } from '@/api/subjects';
import { getUserInfo } from '@/utils/common';
import { useState } from 'react';
import Search from './Search';

function Knowledge() {
  const { id: userId } = getUserInfo();
  const { data, isLoading, refetch } = useQuery('joined', joined);
  const [groupId, setGroupId] = useState(-1);
  const [choiceSubject, setChoiceSubject] = useState(null);

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
      render: (id: number) => (
        <Space>
          <Button theme="solid" type="primary" icon={<IconTop />}>
            置顶
          </Button>
          <Button>编辑</Button>
          <Button theme="light" type="danger">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <Spin>loading</Spin>;
  }
  return (
    <>
      <Search setChoiceSubject={setChoiceSubject} choiceSubject={choiceSubject} />
      <Table
        columns={columns}
        rowKey={(record: any) => record.id}
        dataSource={data?.data}
        // pagination={pagination}
        loading={isLoading}
        // onChange={handleTableChange}
      />
    </>
  );
}
export default Knowledge;
