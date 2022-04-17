import React, { useState } from 'react';
import { AutoComplete, Avatar, Empty } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';

export default () => {
  const [data, setData] = useState([]);
  const [list, setList] = useState([
    { name: '夏可漫', email: 'xiakeman@example.com', abbr: 'XK', color: 'amber' },
    { name: '申悦', email: 'shenyue@example.com', abbr: 'SY', color: 'indigo' },
    { name: '曲晨一', email: 'quchenyi@example.com', abbr: 'CY', color: 'blue' },
    { name: '文嘉茂', email: 'wenjiamao@example.com', abbr: 'JM', color: 'cyan' },
  ]);

  const search = value => {
    let result;
    if (value) {
      result = list.map(item => {
        return { ...item, value: item.name, label: item.email };
      });
    } else {
      result = [];
    }
    setData(result);
  };

  const renderOption = item => {
    const optionStyle = {
      display: 'flex',
    };
    return (
      <>
        <Avatar color={item.color} size="small">
          {item.abbr}
        </Avatar>
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.name}</div>
          <div style={{ marginLeft: 4 }}>{item.email}</div>
        </div>
      </>
    );
  };

  return (
    <AutoComplete
      data={data}
      prefix={<IconSearch />}
      style={{ width: '200px' }}
      renderSelectedItem={option => option.email}
      renderItem={renderOption}
      onSearch={search}
      dropdownStyle={{ width: '200px' }}
      emptyContent={
        <Empty
          style={{ padding: 12, width: 200 }}
          image={<IllustrationNoContent style={{ width: 90, height: 90 }} />}
          description={'暂无内容'}
        />
      }
      onSelect={v => console.log(v)}
    ></AutoComplete>
  );
};
