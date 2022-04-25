import { FC } from 'react';
import { Spin, Banner } from '@douyinfe/semi-ui';

interface FallbackMessageProps {
  message?: string;
  description?: string;
}

const SuspendFallbackLoading: FC<FallbackMessageProps> = ({ message, description }) => {
  return (
    <Spin tip={message} size="large" style={{ width: '100%', height: '100%' }}>
      {description ? (
        <Banner
          fullMode={false}
          type="info"
          icon={null}
          closeIcon={null}
          description={<div>{description}</div>}
        />
      ) : null}
    </Spin>
  );
};

export default SuspendFallbackLoading;
