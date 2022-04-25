import { BackTop, TabPane, Tabs } from '@douyinfe/semi-ui';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router';
import styles from './index.scss';
import { setActiveKey } from '@/store/workbench.slice';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { removeWorkbenchList } from '@/store/workbench.slice';
import { useEffect } from 'react';
export default () => {
  const workbenchList = useAppSelector(state => state.workbenchList.workbenchList);
  const dispatch = useAppDispatch();
  const activeKey = useAppSelector(state => state.workbenchList.activeKey);
  const nav = useNavigate();
  const tabOnclick = (key: string) => {
    dispatch(setActiveKey(key));
    nav(`/workbench/${key}`);
  };
  useEffect(() => {
    const lastTab = workbenchList[workbenchList.length - 1];
    nav(`/workbench/${lastTab.key}`);
    dispatch(setActiveKey(lastTab.key));
  }, [workbenchList]);
  return (
    <div className={styles.workContain}>
      <div>
        <div className={styles.workHeader}>应用中心</div>
        <Tabs
          type="card"
          defaultActiveKey="1"
          onTabClose={key => dispatch(removeWorkbenchList(key))}
          activeKey={activeKey}
          onTabClick={tabOnclick}
          style={{ paddingLeft: '10px' }}
        >
          {workbenchList.map(t => (
            <TabPane closable={t.closable} tab={t.name} itemKey={t.key} key={t.key}></TabPane>
          ))}
        </Tabs>
        <div id="admin-body" className={styles.cardListContain}>
          <Outlet />
        </div>
      </div>

      <BackTop target={() => document.getElementById('admin-body')} />
    </div>
  );
};
