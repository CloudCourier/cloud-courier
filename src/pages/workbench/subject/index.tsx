import { Button, Space, Table, Avatar, Tooltip, Popconfirm } from '@douyinfe/semi-ui';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { delMySubject, getMembers, mySubjects } from '@/api/subjects';
import { IconGlobe } from '@douyinfe/semi-icons';
import { openProjectModal, setSubjectId, setToken } from '@/store/subject.slice';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import SubjectModal from './subjectModal';
import { ToastError } from '@/utils/common';

function Tables() {
  // TODO 网络请求
  const queryClient = useQueryClient();
  const { mutate } = useMutation((id: number) => delMySubject(id), {
    onError: () => {
      ToastError('删除失败');
    },
    onSettled: () => {
      queryClient.invalidateQueries('mySubjects');
    },
  });
  const { data, isLoading } = useQuery('mySubjects', mySubjects);
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

  const editerModal = (e: any) => {
    dispatch(setSubjectId(e.currentTarget.getAttribute('id')));
    dispatch(setToken(e.currentTarget.getAttribute('attr-token')));
    dispatch(openProjectModal('editer'));
  };
  const columns = [
    {
      title: '图标',
      dataIndex: 'logo',
      width: '20%',
      render: (logo: string) => <Avatar src={logo} />,
    },
    {
      title: '名字',
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
          <Button onClick={editerModal} id={`${id}`} attr-token={object.token}>
            详情
          </Button>
          <Popconfirm
            title="真的要删除这个项目吗？"
            content="此修改将不可逆"
            onConfirm={() => mutate(id)}
          >
            <span style={{ display: 'inline-block' }}>
              <Tooltip content={'删除项目'}>
                <Button id={`${id}`}>删除</Button>
              </Tooltip>
            </span>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => dispatch(openProjectModal('add'))} icon={<IconGlobe />}>
        新建项目
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
    </>
  );
}
export default Tables;
