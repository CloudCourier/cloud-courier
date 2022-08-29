import { Form } from '@douyinfe/semi-ui';

export default function UserPersonalStatement() {
  return (
    <Form.TextArea
      field="personalStatement"
      autosize
      rows={1}
      showClear
      maxCount={100}
      maxLength={100}
      label="个人说明"
    />
  );
}
