import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { useNavigate, useParams } from 'react-router-dom';
import SubLayout from '../../layouts/SubLayout';
import IconActionButton from '../../components/IconActionButton';
import { UserOutline } from 'antd-mobile-icons';
import { getSessionMessages } from '../../api/consult';

const ConsultationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 会话唯一标识

  // 头部右侧操作区（仅保留转人工）
  const rightActions = (
    <IconActionButton
      icon={<UserOutline />}
      ariaLabel="转人工"
      onClick={() => navigate('/my/tickets/create')}
    />
  );

  // 消息流状态
  const [messages, setMessages] = useState([]);

  // 拉取历史消息
  useEffect(() => {
    if (!id) return;
    getSessionMessages(id)
      .then(res => {
        if (Array.isArray(res)) {
          setMessages(res);
        } else if (res && Array.isArray(res.messages)) {
          setMessages(res.messages);
        }
      })
      .catch(err => {
        // 可选：错误处理
        console.error('加载历史消息失败', err);
      });
  }, [id]);

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
      children={
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <MessageList messages={messages} />
          </div>
          <InputBar onSend={handleSend} />
        </div>
      }
    />
  );
};

export default ConsultationPage;
