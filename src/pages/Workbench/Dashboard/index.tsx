import { Card, Avatar } from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { workbenchChildrenKey } from '@/routers/workbenchChildren';
import { addWorkbenchList } from '@/store/workbench.slice';
import { setActiveKey } from '@/store/workbench.slice';
import { choiceIdEle } from '@/utils/common';
import { useAppDispatch } from '@/hooks/store';
import { useNavigate } from 'react-router';
import styles from './index.scss';

export default () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const choiceCard = e => {
    const id = choiceIdEle(e).getAttribute('id');
    dispatch(addWorkbenchList(id));
    dispatch(setActiveKey(id));
    nav(`/workbench/${id}`);
  };
  const CardList = workbenchChildrenKey.map(item =>
    item.path === 'dashboard' ? null : (
      <div key={item.key} id={item.key} onClick={choiceCard}>
        <Card
          shadows="hover"
          style={{ width: '260px', margin: '20px' }}
          bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          key={item.key}
        >
          <Meta
            title={item.name}
            avatar={
              <Avatar
                alt="Card meta img"
                size="default"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
              />
            }
          />
        </Card>
      </div>
    ),
  );
  return <div className={styles.cardList}>{CardList}</div>;
};
