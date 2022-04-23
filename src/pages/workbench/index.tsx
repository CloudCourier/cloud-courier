import { BackTop, TabPane, Tabs } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router';
import styles from './index.scss';
import { setActiveKey } from '@/store/workbench.slice';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import { removeWorkbenchList } from '@/store/workbench.slice';
export default () => {
  const workbenchList = useAppSelector(state => state.workbenchList.workbenchList);
  const dispatch = useAppDispatch();
  const activeKey = useAppSelector(state => state.workbenchList.activeKey);
  const nav = useNavigate();
  const tabOnclick = (key: string) => {
    dispatch(setActiveKey(key));
    nav(`/workbench/${key}`);
  };
  return (
    <div className={styles.workContain}>
      <div className="vw100 flex flex1 overflow-x">
        <div className="flex-c flex1 overflow-x-h">
          <Tabs
            type="card"
            defaultActiveKey="1"
            // TODO 删除了之后跳到前一个页面
            onTabClose={key => dispatch(removeWorkbenchList(key))}
            activeKey={activeKey}
            onTabClick={tabOnclick}
          >
            {workbenchList.map(t => (
              <TabPane closable={t.closable} tab={t.name} itemKey={t.key} key={t.key}></TabPane>
            ))}
          </Tabs>
          <div id="admin-body" className="overflow-y rel h100">
            <Outlet />
          </div>
        </div>

        <BackTop target={() => document.getElementById('admin-body')} />
      </div>
    </div>
  );
};
