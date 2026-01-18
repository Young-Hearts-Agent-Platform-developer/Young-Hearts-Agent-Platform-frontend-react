import React, { useState } from 'react';
import MessageList from '../../components/MessageList';
import InputBar from '../../components/InputBar';
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

  // 消息流状态
  const [messages, setMessages] = useState([
    { role: 'ai', content: '您好，请问有什么可以帮您？', time: '09:00' },
  ]);

  // 发送消息
  const handleSend = (content) => {
    const now = new Date();
    setMessages([
      ...messages,
      { role: 'user', content, time: now.toLocaleTimeString().slice(0,5) },
    ]);
  };

  return (
    <SubLayout
      title="智能体咨询"
      showBack={true}
      onBack={() => navigate(-1)}
      rightActions={rightActions}
      headerStyle={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}
    >
      {/* 主内容区：消息流与输入区 */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 56 }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MessageList messages={messages} />
        </div>
        <InputBar onSend={handleSend} />
      </div>
    </SubLayout>
  );
};

export default ConsultationPage;
