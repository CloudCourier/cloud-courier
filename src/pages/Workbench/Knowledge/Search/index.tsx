import { useState } from 'react';
import { AutoComplete, Avatar, Button, Empty, Form, Input, Tag } from '@douyinfe/semi-ui';
import { IconSearch, IconGlobe } from '@douyinfe/semi-icons';
import { IllustrationConstruction } from '@douyinfe/semi-illustrations';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import styles from './index.scss';
import { openDB } from 'idb';
import { getUserInfo } from '@/utils/common';

const { Label } = Form;
const Search = ({ choiceSubject, setChoiceSubject }) => {
  const [data, setData] = useState([]);
  const subjectList = useRef([]);
  const userInfo = getUserInfo();
  const [choiceSubjectId, setChoiceSubjectId] = useState(-1);
  const loc = window.location.href;
  useEffect(() => {
    openDB('cloudCourier').then(db => {
      db.getAll('subjectList').then(res => {
        subjectList.current = res.map(item => ({
          ...item,
          value: item.subjectName,
          label: item.subjectLogo,
        }));
      });
    });
  }, []);

  const search = useCallback(
    debounce(value => {
      let result;
      if (value && subjectList.current !== []) {
        result = subjectList.current.filter(item => item.subjectName.includes(value));
      } else {
        result = [];
      }
      setData(result);
    }, 300),
    [],
  );

  const renderOption = item => {
    return (
      <div style={{ display: 'flex' }}>
        <Avatar src={item.subjectLogo} size="small" />
        <div style={{ marginLeft: 4 }}>
          <div style={{ fontSize: 14, marginLeft: 4 }}>{item.subjectName}</div>
          <div style={{ marginLeft: 4 }}>
            {userInfo.id === item.ownerId ? <Tag color="orange">创造者</Tag> : <Tag>组员</Tag>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Form className={styles.searchBar}>
      <Label
        text="组织"
        required
        extra={
          <AutoComplete
            data={data}
            prefix={<IconSearch />}
            style={{ width: '300px', zIndex: 999, backgroundColor: 'white' }}
            renderSelectedItem={option => option.subjectName}
            renderItem={renderOption}
            onSearch={search}
            dropdownClassName="semi-search-dropdown"
            dropdownStyle={{ width: '300px' }}
            emptyContent={
              <Empty
                style={{ padding: 12, width: 300 }}
                image={<IllustrationConstruction style={{ width: 120, height: 120 }} />}
                description={'暂无内容'}
              />
            }
            onSelect={v => {
              setChoiceSubject(v);
              const id = subjectList.current.find(item => (item.subjectName = v)).subjectId;
              setChoiceSubjectId(id);
            }}
          ></AutoComplete>
        }
      />
      <Label text="文章标题" extra={<Input placeholder="请输入" />} />
      <Label
        text={
          choiceSubject === null ? (
            '未选择组织'
          ) : (
            <div>
              {' '}
              当前组织为<Tag color="blue">{choiceSubject}</Tag>
            </div>
          )
        }
        extra={
          <Button
            disabled={choiceSubject === null}
            icon={<IconGlobe />}
            onClick={() => {
              window.open(`${loc}/release/${choiceSubjectId}`);
            }}
          >
            新建文章
          </Button>
        }
      />
    </Form>
  );
};
export default Search;
