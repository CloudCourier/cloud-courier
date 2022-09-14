import {
  Button,
  Space,
  Table,
  Avatar,
  Tooltip,
  Popconfirm,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { invitations, reply as replyApi } from '@/api/subjects';
import { openProjectModal, setSubjectId, setToken } from '@/store/subject.slice';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { ToastError, ToastSuccess } from '@/utils/common';
import { useState } from 'react';
import { AcceptStatus } from './types';

function Tables() {
  const { data, isLoading } = useQuery('invitations', () => invitations(0, 20));
  const [btnLoading, setBtnLoading] = useState(false);
  const reply = (id: number, accept: any) => {
    setBtnLoading(true);
    replyApi(id, accept)
      .then(() => {
        ToastSuccess('处理成功');
      })
      .catch(() => {
        ToastError('处理失败');
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const columns = [
    {
      title: '处理状态',
      dataIndex: 'accept_status',
      width: '15%',
      render: (status: string) => {
        switch (status) {
          case AcceptStatus.UNHANDLED:
            return (
              <Tag size="large" color="light-blue">
                未处理
              </Tag>
            );
            break;
          case AcceptStatus.ACCEPTED:
            return (
              <Tag size="large" color="light-green">
                已同意
              </Tag>
            );
            break;
          case AcceptStatus.REJECTED:
            return (
              <Tag size="large" color="red">
                已拒绝
              </Tag>
            );
            break;
          case AcceptStatus.BLOCKED:
            return (
              <Tag size="large" color="grey">
                已忽略
              </Tag>
            );
            break;
          default:
            <Tag size="large" color="violet">
              {status}
            </Tag>;
            break;
        }
      },
    },
    {
      title: '组织图标',
      dataIndex: 'subject_logo',
      width: '15%',
      render: (logo: string) => <Avatar src={logo} />,
    },
    {
      title: '组织名',
      dataIndex: 'subject_name',
      width: '20%',
    },
    {
      title: '邀请人',
      dataIndex: 'from_avatar',
      width: '15%',
      render: (logo: string, record) => (
        <Space>
          <Avatar src={logo} />
          <Typography.Text>{record.from_name}</Typography.Text>
        </Space>
      ),
    },

    {
      title: '操作',
      dataIndex: 'invite_id',
      render: (id: number, record) => {
        if (record.accept_status !== AcceptStatus.UNHANDLED) {
          return (
            <Space>
              <Typography.Text>已处理</Typography.Text>
            </Space>
          );
        }
        return (
          <Space>
            <Popconfirm
              title="来自组织的邀请"
              content="是否加入组织"
              onConfirm={() => reply(id, AcceptStatus.ACCEPTED)}
            >
              <span style={{ display: 'inline-block' }}>
                <Tooltip content={'同意邀请'}>
                  <Button disabled={btnLoading}>同意</Button>
                </Tooltip>
              </span>
            </Popconfirm>
            <Popconfirm
              title="来自组织的邀请"
              content="拒绝加入此组织吗"
              onConfirm={() => reply(id, AcceptStatus.REJECTED)}
            >
              <span style={{ display: 'inline-block' }}>
                <Tooltip content={'拒绝邀请'}>
                  <Button disabled={btnLoading}>拒绝</Button>
                </Tooltip>
              </span>
            </Popconfirm>
            <Popconfirm
              title="来自组织的邀请"
              content="是否忽略该邀请"
              onConfirm={() => reply(id, AcceptStatus.BLOCKED)}
            >
              <span style={{ display: 'inline-block' }}>
                <Tooltip content={'忽略邀请'}>
                  <Button disabled={btnLoading}>忽略</Button>
                </Tooltip>
              </span>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        rowKey={(record: any) => record.id}
        dataSource={data?.data.content}
        // pagination={pagination}
        loading={isLoading}
        // onChange={handleTableChange}
      />
    </>
  );
}
export default Tables;
