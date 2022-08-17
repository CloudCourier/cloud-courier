import { Button, Input, Modal, Space, Spin } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { IllustrationConstruction } from '@douyinfe/semi-illustrations';
import { debounce } from 'lodash';
import { FC, useCallback, useState } from 'react';
import { queryMembers } from '@/api/user';
import { invite as inviteApi } from '@/api/subjects';
import { IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { Card, Empty, Skeleton, Avatar, Typography } from '@douyinfe/semi-ui';
import styles from './index.scss';
import { ToastSuccess, ToastWaring } from '@/utils/common';
import { AcceptStatus } from '@/pages/Workbench/Invitations/types';

const InviteModal = props => {
  const { groupId } = props;
  const [searchValue, setSearchValue] = useState('');
  const [searchMember, setSearchMember] = useState(null);
  const { Meta } = Card;
  const { Title, Paragraph, Image } = Skeleton;

  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);

  const search = () => {
    setLoading(true);
    setSearchMember(''); // 打开骨架屏
    queryMembers(searchValue)
      .then(data => {
        if (data.data) {
          setSearchMember(data.data);
        }
      })
      .catch(() => {
        setSearchMember(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const invite = (id, member) => {
    setInviteLoading(true);
    inviteApi(id, member)
      .then(data => {
        if (data.data.status !== AcceptStatus.UNHANDLED) {
          ToastWaring('已是组织成员，请勿重复邀请');
        } else {
          ToastSuccess('邀请成功');
        }
      })
      .finally(() => {
        setInviteLoading(false);
      });
  };
  const renderOption = item => {
    if (item.error) {
      return <>{item.message}</>;
    }
    return (
      <Card
        className={styles.memberCard}
        style={{ maxWidth: 300 }}
        title={
          <Meta
            title={
              <Skeleton style={{ width: 80 }} placeholder={<Title />} loading={loading}>
                <Typography.Title heading={5}>{item.name}</Typography.Title>
              </Skeleton>
            }
            description={
              <Skeleton
                style={{ width: 150, marginTop: 12 }}
                placeholder={<Paragraph rows={1} />}
                loading={loading}
              >
                <Typography.Text>这个人很懒，没有个人简介</Typography.Text>
              </Skeleton>
            }
            avatar={
              <Skeleton placeholder={<Skeleton.Avatar />} loading={loading}>
                <Avatar alt="Card meta img" size="default" src={item.logo} />
              </Skeleton>
            }
          />
        }
        headerExtraContent={
          <Skeleton style={{ width: 50 }} placeholder={<Paragraph rows={1} />} loading={loading}>
            <Button loading={inviteLoading} onClick={() => invite(groupId, item.id)}>
              邀请
            </Button>
          </Skeleton>
        }
      ></Card>
    );
  };

  return (
    <>
      <Modal title="🔍" {...props} header={null}>
        <Space className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <Input
              prefix={<IconSearch />}
              showClear
              onChange={value => setSearchValue(value)}
              style={{ width: '80%' }}
            ></Input>
            <Button onClick={search}>搜索</Button>
          </div>
          {searchMember === null ? (
            <Empty
              image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
              darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
              description={'开始寻找小伙伴吧'}
              style={{ padding: '30px' }}
            />
          ) : (
            <div>{renderOption(searchMember)}</div>
          )}
        </Space>
      </Modal>
    </>
  );
};
export default InviteModal;
