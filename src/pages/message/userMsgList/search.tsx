import { useState } from 'react';
import { AutoComplete, Avatar, Empty } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { IllustrationConstruction } from '@douyinfe/semi-illustrations';
import './style.scss';

export default () => {
  const [data, setData] = useState([]);
  const [list, setList] = useState([
    { name: '夏可漫', email: 'xiakeman@', abbr: 'XK', color: 'amber' },
    { name: '申悦', email: 'shenyue@e', abbr: 'SY', color: 'indigo' },
    { name: '申悦', email: 'shenyue@e', abbr: 'SY', color: 'indigo' },
    { name: '曲晨一', email: 'quchenyi@', abbr: 'CY', color: 'blue' },
    { name: '曲晨一', email: 'quchenyi@', abbr: 'CY', color: 'blue' },
    { name: '文嘉茂', email: 'wenjiamao@exam', abbr: 'JM', color: 'cyan' },
    { name: '文嘉茂', email: 'wenjiamao@exam', abbr: 'JM', color: 'cyan' },
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
      dropdownClassName="semi-search-dropdown"
      dropdownStyle={{ width: '200px' }}
      emptyContent={
        <Empty
          style={{ padding: 12, width: 200 }}
          image={<IllustrationConstruction style={{ width: 90, height: 90 }} />}
          description={'暂无内容'}
        />
      }
      onSelect={v => console.log(v)}
    ></AutoComplete>
  );
};
