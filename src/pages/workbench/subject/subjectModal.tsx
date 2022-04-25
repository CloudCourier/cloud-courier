import { Modal, Form, Button, Space, Input } from '@douyinfe/semi-ui';
import { ToastError, ToastSuccess } from '@/utils/common';
import { addSubjects } from '@/api/subjects';
import UploadImg from '@/components/upload';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { useQueryClient } from 'react-query';
import { closeProjectModal } from '@/store/subject.slice';
import { useState } from 'react';
// import { useEffect } from 'react';

export default () => {
  // const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const subjectModalOpen = useAppSelector(state => state.subject.projectModalOpen);
  const logo = useAppSelector(state => state.subject.logo);
  const [name, setName] = useState<string | number>(undefined);
  const model = useAppSelector(state => state.subject.modalModel);
  // const id = useAppSelector(state => state.subject.id);
  // let MemberList = <div>222</div>;
  // useEffect(() => {
  //   console.log('id', id);
  //   if (model === 'operateMembers' && id !== undefined) {
  //     getMembers(id).then(res => {
  //       console.log('res', res);
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       MemberList = res.data.map((item: any) => (
  //         <ul>
  //           <li key={item.id}>{item.username}</li>
  //         </ul>
  //       ));
  //       console.log(MemberList);
  //     });
  //   }
  // }, [id, MemberList]);

  const handsubmit = () => {
    console.log(name, logo, model);
    if (model === 'add') {
      if (!logo) {
        ToastError('请上传LOGO');
        return;
      }
      addSubjects({ name, logo } as { name: string; logo: string })
        .then(() => {
          ToastSuccess('添加成功');
          queryClient.invalidateQueries('mySubjects');
          dispatch(closeProjectModal());
        })
        .catch(() => {
          ToastError('添加失败');
        });
    } else if (model === 'editor') {
      // 编辑
      console.log('ss');
    } else {
      ToastError('mode错误,请联系管理员');
    }
  };

  const onClose = () => {
    dispatch(closeProjectModal());
    // form.resetFields();
    setName(undefined);
  };

  return (
    <Modal
      // width="100%"
      // onClose={onClose}
      onCancel={onClose}
      visible={subjectModalOpen}
      // bodyStyle={{ paddingBottom: 80 }}
      // extra={
      //   <Space>
      //     <Button onClick={onClose}>Cancel</Button>
      //     <Button onClick={handsubmit} type="primary">
      //       Submit
      //     </Button>
      //   </Space>
      // }
    >
      231
      {/* <Form layout="vertical" form={form}>
        <UploadImg />
        <Form.Item
          name="name"
          label="组织名称"
          rules={[{ required: true, message: '请输入组织名称' }]}
        >
          <Input
            placeholder="请输入项目名称"
            name="name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="off"
          />
        </Form.Item>
      </Form> */}
    </Modal>
  );
};
