import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubLayout from '../../layouts/SubLayout';
import IconActionButton from '../../components/IconActionButton';
// Vant React Icons 示例（如未安装请后续补充）
import { MessageOutline, UserOutline } from 'antd-mobile-icons';

const ConsultationPage = () => {
  const navigate = useNavigate();

  // 头部右侧操作区
  const rightActions = (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconActionButton
        icon={<MessageOutline />}
        ariaLabel="历史会话"
        onClick={() => navigate('/history-sessions')}
      />
      <IconActionButton
        icon={<UserOutline />}
        ariaLabel="转人工"
        onClick={() => navigate('/my/tickets/create')}
      />
    </div>
  );

  return (
    <SubLayout
      title="智能体咨询"
      showBack={true}
      onBack={() => navigate(-1)}
      rightActions={rightActions}
      headerStyle={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}
    >
      {/* 主内容区后续补充 */}
      <div style={{ height: 48 }} />
    </SubLayout>
  );
};

export default ConsultationPage;
