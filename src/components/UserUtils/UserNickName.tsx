import { randomString } from '@/utils/common';
import Validator from '@/utils/validator';
import { IconEmoji } from '@douyinfe/semi-icons';
import { Form, Typography } from '@douyinfe/semi-ui';
import { useFormApi } from '@douyinfe/semi-ui/lib/es/form';

interface ICUserNickName {
  disabled: boolean;
}

export default function UserNickName(props: ICUserNickName) {
  const formApi = useFormApi();

  return (
    <Form.Input
      field="nickname"
      label={{
        text: '用户昵称',
        extra: (
          <Typography.Text
            title="随机昵称"
            link={!props.disabled}
            disabled={props.disabled}
            onClick={() => {
              if (props.disabled) return;
              formApi.setValue('nickname', randomString());
              formApi.validate(['nickname']);
            }}
          >
            随机
            <IconEmoji />
          </Typography.Text>
        ),
        required: true,
      }}
      validate={Validator['nickNameValidate']}
      maxLength={20}
      showClear
    ></Form.Input>
  );
}
