import { Modal, Form, Button, Space, Input } from '@douyinfe/semi-ui';
import { ToastError, ToastSuccess } from '@/utils/common';
import { addSubjects, getMembers } from '@/api/subjects';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { useQueryClient } from 'react-query';
import { closeProjectModal } from '@/store/subject.slice';
import { useEffect, useRef, useState } from 'react';
import type { BaseFormApi } from '@douyinfe/semi-foundation/lib/es/form/interface';
import Upload from '@/components/upload';
// import { useEffect } from 'react';

export default () => {
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(false);
  const formApi = useRef<BaseFormApi>();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const subjectModalOpen = useAppSelector(state => state.subject.projectModalOpen);
  const model = useAppSelector(state => state.subject.modalModel);
  const id = useAppSelector(state => state.subject.id);
  const [memberList, setMemberList] = useState([]);
  useEffect(() => {
    console.log('id', id);
    if (model === 'editer' && id !== undefined) {
      // 因为 semi design form 为按需加载，当第一次打开的时候需要降低请求的优先级，让formapi先初始化
      // if (!formApi.current) {
      //   setTimeout(() => {
      //     getMembersList();
      //   }, 0);
      //   return;
      // }
      // getMembersList();
    } else if (model === 'memberManage' && id !== undefined) {
      if (!formApi.current) {
        setTimeout(() => {
          getMembersList();
        }, 0);
        return;
      }
      getMembersList();
    }
  }, [id]);
  const getMembersList = () => {
    getMembers(id).then(res => {
      setMemberList(res.data);
    });
  };
  // const getMembersList = () => {
  //   getMembers(id).then(res => {
  //     console.log('res', res.data[0]);
  //     setLogo(res.data[0].avatar);
  //     formApi.current.setValues(
  //       {
  //         name: res.data[0].username,
  //       },
  //       { isOverride: true },
  //     );
  //   });
  // };
  const handleSubmit = form => {
    const { name } = form;
    if (model === 'add') {
      if (!logo) {
        ToastError('请上传LOGO');
        return;
      }
      setLoading(true);
      addSubjects({ name, logo } as { name: string; logo: string })
        .then(() => {
          ToastSuccess('添加成功');
          queryClient.invalidateQueries('mySubjects');
          onClose();
        })
        .catch(() => {
          ToastError('添加失败');
        });
    } else if (model === 'editer') {
      // 编辑
      ToastSuccess('待开发😳');
    } else {
      ToastError('mode错误,请联系管理员');
    }
  };

  const onClose = () => {
    dispatch(closeProjectModal());
    setLoading(false);
    setLogo('');
    formApi.current.reset();
  };

  return (
    <Modal
      // width="100%"
      onCancel={onClose}
      visible={subjectModalOpen}
      footer={<></>}
    >
      <Form
        getFormApi={api => (formApi.current = api)}
        onSubmit={form => handleSubmit(form)}
        disabled={loading}
      >
        <>
          <Form.Label
            text="组织图标"
            required
            extra={<Upload setAvatarUrl={setLogo} avatarUrl={logo} field="logo" />}
          ></Form.Label>
          <Form.Input
            field="name"
            rules={[{ required: true, message: '请输入名称' }]}
            label="组织名称"
            style={{ width: '100%' }}
            placeholder="输入组织名称"
          ></Form.Input>
          <Button htmlType="submit" type="tertiary" disabled={loading}>
            创建
          </Button>
        </>
      </Form>
    </Modal>
  );
};
