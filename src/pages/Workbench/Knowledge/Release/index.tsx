import RichEditor from './RichEditor';
import styles from './index.scss';
import { Button, Input } from '@douyinfe/semi-ui';
import { IconSend } from '@douyinfe/semi-icons';
import { useState } from 'react';

const Release = () => {
  const [title, setTitle] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const releaseHandle = () => {
    let content = document.querySelector('.markdown-body').innerHTML;
    content = content.slice(0, content.length - 9);
    console.log(title, editorValue, content);
  };
  return (
    <div className={styles.releaseContainer}>
      <div className="realeaseBar"></div>
      <div className="realeaseTitle">
        <Input
          style={{ border: 'none' }}
          prefix="标题"
          size="large"
          value={title}
          onChange={setTitle}
          maxLength={255}
          suffix={
            <Button onClick={releaseHandle} icon={<IconSend style={{ color: 'rgb(0,100,250)' }} />}>
              发布
            </Button>
          }
        />
      </div>
      <RichEditor value={editorValue} setValue={setEditorValue} />
    </div>
  );
};
export default Release;
