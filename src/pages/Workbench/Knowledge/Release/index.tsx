import RichEditor from './RichEditor';
import styles from './index.scss';
import { Button, Input } from '@douyinfe/semi-ui';
import { IconSend } from '@douyinfe/semi-icons';

const Release = () => {
  const releaseHandle = () => {
    console.log(11);
  };
  return (
    <div className={styles.releaseContainer}>
      <div className="realeaseBar"></div>
      <div className="realeaseTitle">
        <Input
          style={{ border: 'none' }}
          prefix="标题"
          size="large"
          suffix={
            <Button icon={<IconSend style={{ color: 'rgb(0,100,250)' }} onClick={releaseHandle} />}>
              发布
            </Button>
          }
        />
      </div>
      <RichEditor />
    </div>
  );
};
export default Release;
