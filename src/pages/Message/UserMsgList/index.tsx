import Search from './search';
import { useAppSelector } from '@/hooks/store';
import { choiceIdEle, choiceIdEle2 } from '@/utils/common';
import { Avatar, Badge, Divider, Dropdown, Tooltip } from '@douyinfe/semi-ui';
import { IconTick } from '@douyinfe/semi-icons';
import { BROAD_CAST_CHANNEL } from '@/consts';
import styles from './index.scss';
import React, { useState } from 'react';
import type { UserMessage } from '@/types/user';
import dayjs from 'dayjs';

function userMsgList({ setSearch, setUserId }) {
  const [topDropdownVisible, setTopDropdownVisible] = useState(false);
  const [cancelDropdownVisible, setCancelDropdownVisible] = useState(false);
  const [dropdownLocation, setDropdownLocation] = useState({
    clientX: 0,
    clientY: 0,
  });
  const [topKey, setTopKey] = useState(-1);
  const broadCastChannel = new BroadcastChannel(BROAD_CAST_CHANNEL);
  const message = useAppSelector<UserMessage[]>(state => state.message.message);
  const choiceUser = e => {
    const ele = choiceIdEle(e);
    // Array.prototype.map.call(ele.parentElement.children, item => {
    //   item.className = item.className.replace('active', '');
    // });
    // ele.className = `${ele.className} active`;
    setUserId(ele.getAttribute('id'));
  };

  const deleteChatList = key => {
    broadCastChannel.postMessage({
      type: 'ServerboundDeleteChatListPacket',
      key,
    });
  };
  const choiceTopUser = e => {
    const ele = choiceIdEle(e);
    const eleId = ele.getAttribute('id');
    if (eleId.substring(0, 2) !== 's:') return false;
    setUserId(eleId);
  };
  const topContextMenuHandle = (event: React.MouseEvent<HTMLElement>) => {
    const id = choiceIdEle2(event.target).getAttribute('id');
    if (!id || id.substring(0, 1) !== 's') return;
    setTopKey(id);
    setTopDropdownVisible(true);
    const { clientX, clientY } = event;
    setDropdownLocation({
      clientX,
      clientY,
    });
    event.preventDefault();
  };
  const cancelTopContextMenuHandle = (event: React.MouseEvent<HTMLElement>) => {
    const id = choiceIdEle2(event.target).getAttribute('id');
    if (!id || id.substring(0, 1) !== 's') return;
    setTopKey(id);
    setCancelDropdownVisible(true);
    const { clientX, clientY } = event;
    setDropdownLocation({
      clientX,
      clientY,
    });
    event.preventDefault();
  };

  const topMsgHandle = () => {
    setTopDropdownVisible(false);
    broadCastChannel.postMessage({
      type: 'ServerboundAddChatListPacket',
      key: topKey,
      message: JSON.stringify({ top: Date.now() }),
    });
  };
  const cancelMsgHandle = () => {
    setCancelDropdownVisible(false);
    broadCastChannel.postMessage({
      type: 'ServerboundAddChatListPacket',
      key: topKey,
      message: JSON.stringify({ top: false }),
    });
  };
  const MsgList = () =>
    message.map(item => (
      <div key={item.key} id={item.key} className={styles.feedCard} onClick={choiceUser}>
        <div className={styles.feedCardAvatar}>
          <div className={styles.avatar}>
            <Badge
              count={item.preferences.unRead === 0 ? null : item.preferences.unRead}
              type="danger"
            >
              <Avatar alt="logo" src={item.appLogo} size="small" />
            </Badge>
          </div>
        </div>
        <div className={styles.feedCardMain}>
          <div className={styles.feedCardHeader}>
            <div className={styles.feedCardName}>
              <p className={styles.feedCardNameText}>{item.name}</p>
            </div>
            {/* (item.create_time) */}
            <div className={styles.feedCardHeaderTime}>
              {dayjs(item?.lastDate).format('HH:mm:ss')}
            </div>
          </div>
          <div className={styles.feedMessagePreviewContainer}>
            <div className={styles.feedMessagePreviewTextOverflow}>
              <span className={styles.feedMessagePreviewContent}>{item.location}</span>
            </div>
          </div>
          <div className={styles.feedCardDoneButton}>
            <Tooltip content="完成">
              <IconTick className={styles.closeIcon} onClick={() => deleteChatList(item.key)} />
            </Tooltip>
          </div>
        </div>
      </div>
    ));
  const TopList = () => {
    const _topList = message
      .filter(item => item?.preferences?.top)
      // @ts-ignore,top可能是false和时间戳，这里一定是时间戳
      .sort((a, b) => b.preferences.top - a.preferences.top);
    return _topList.map(item => (
      <>
        <div className={styles.feedCardAvatar} key={item.key} id={item.key} onClick={choiceTopUser}>
          <Tooltip content={item.name}>
            <div className={styles.avatar}>
              <Badge
                count={item.preferences.unRead === 0 ? null : item.preferences.unRead}
                type="danger"
              >
                <Avatar alt="logo" src={item.appLogo} size="small" />
              </Badge>
              <div className={styles.name}>{item.name}</div>
            </div>
          </Tooltip>
        </div>
      </>
    ));
  };

  return (
    <div className={styles.messageContain}>
      <div className={styles.searchContain}>
        <Search setSearch={setSearch} />
      </div>
      <div
        className={styles.topList}
        style={{ display: TopList().length !== 0 ? 'block' : 'none' }}
        onContextMenu={cancelTopContextMenuHandle}
      >
        <p id="topList">
          <Dropdown
            trigger={'custom'}
            position={'bottomLeft'}
            stopPropagation
            visible={cancelDropdownVisible}
            getPopupContainer={() => document.getElementById('topList')}
            onClickOutSide={() => setCancelDropdownVisible(false)}
            style={{
              position: 'absolute',
              top: `${dropdownLocation.clientY - 10}px`,
              left: `${dropdownLocation.clientX}px`,
              boxShadow: '0 0 1px rgba(0,0,0,0.3),0 4px 14px rgba(0,0,0,0.1)',
              borderRadius: '6px',
              backgroundColor: 'white',
              zIndex: 9999,
              width: '160px',
            }}
            render={
              <Dropdown.Menu>
                <Dropdown.Item onClick={cancelMsgHandle}>取消置顶</Dropdown.Item>
              </Dropdown.Menu>
            }
          ></Dropdown>
        </p>
        <div className={styles.topListContainer}>{TopList()}</div>
      </div>

      <Divider />
      <div className={styles.messageList} onContextMenu={topContextMenuHandle}>
        <p id="messageList">
          <Dropdown
            trigger={'custom'}
            position={'bottomLeft'}
            stopPropagation
            visible={topDropdownVisible}
            getPopupContainer={() => document.getElementById('messageList')}
            onClickOutSide={() => setTopDropdownVisible(false)}
            style={{
              position: 'absolute',
              top: `${dropdownLocation.clientY - 10}px`,
              left: `${dropdownLocation.clientX}px`,
              boxShadow: '0 0 1px rgba(0,0,0,0.3),0 4px 14px rgba(0,0,0,0.1)',
              borderRadius: '6px',
              backgroundColor: 'white',
              zIndex: 9999,
              width: '160px',
            }}
            render={
              <Dropdown.Menu>
                <Dropdown.Item onClick={topMsgHandle}>置顶</Dropdown.Item>
              </Dropdown.Menu>
            }
          ></Dropdown>
        </p>
        {MsgList()}
      </div>
    </div>
  );
}
export default userMsgList;
