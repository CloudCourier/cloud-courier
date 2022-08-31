import { useState } from 'react';
import { AutoComplete, Avatar, Empty } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { IllustrationConstruction } from '@douyinfe/semi-illustrations';
import styles from './search.scss';
import { useAppSelector } from '@/hooks/store';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

export default ({ setSearch }) => {
  const [data, setData] = useState([]);
  // TODO message 为空?
  let message = useAppSelector(state => state.message.message);
  const msgRef = useRef([]);
  useEffect(() => {
    if (message === []) return;
    message = message.map(item => {
      return { ...item, value: item.name, label: item.appLogo };
    });
    msgRef.current = message;
  }, [message]);

  const search = useCallback(
    debounce(value => {
      let result;
      if (value && message !== []) {
        result = msgRef.current.filter(item => item.name.includes(value));
      } else {
        result = [];
      }
      setData(result);
    }, 300),
    [],
  );

  const renderOption = item => {
    return (
      <div onClick={() => setSearch(item.key)} style={{ display: 'flex' }}>
        <Avatar src={item.appLogo} size="small" />
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.name}</div>
          <div style={{ marginLeft: 4 }}>{dayjs(item.timestamp).format('HH:mm:ss')}</div>
        </div>
      </div>
    );
  };

  return (
    <AutoComplete
      className={styles.msgSearch}
      data={data}
      prefix={<IconSearch />}
      style={{ width: '210px', position: 'fixed', zIndex: 999, backgroundColor: 'white' }}
      renderSelectedItem={option => option.name}
      renderItem={renderOption}
      onSearch={search}
      dropdownClassName="semi-search-dropdown"
      dropdownStyle={{ width: '204px' }}
      emptyContent={
        <Empty
          style={{ padding: 12, width: 204 }}
          image={<IllustrationConstruction style={{ width: 90, height: 90 }} />}
          description={'暂无内容'}
        />
      }
      // onSelect={(v: AutoCompleteItems) => {

      //   // setSearch(v)
      // }}
    ></AutoComplete>
  );
};
