import React, { useState, useEffect } from 'react';
import Toast from '../../components/Toast';
import MessageList from './MessageList';
import ReferenceCard from './ReferenceCard';
import QuickActions from './QuickActions';
import InputBar from './InputBar';
import { useNavigate, useParams } from 'react-router-dom';
import SubLayout from '../../layouts/SubLayout';
import IconActionButton from '../../components/IconActionButton';
import { UserOutline } from 'antd-mobile-icons';
import { getSessionMessages, chatSSE } from '../../api/consult';

const ConsultationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 会话唯一标识

  // 弹窗状态
  const [toast, setToast] = useState({ visible: false, message: '' });
  // 消息流状态
  const [messages, setMessages] = useState([]);

  // 头部右侧操作区（仅保留转人工）
  const rightActions = (
    <IconActionButton
      icon={<UserOutline />}
      ariaLabel="转人工"
      onClick={() => navigate('/my/tickets/create')}
    />
  );

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


  // AI 回复流式追加
  const [loading, setLoading] = useState(false);
  const handleSend = async (content) => {
    if (!content) return;
    setLoading(true);
    const now = new Date();
    const userMsg = { role: 'user', content, time: now.toLocaleTimeString().slice(0,5) };
    setMessages(prev => [...prev, userMsg]);
    let aiMsg = { role: 'ai', content: '', time: now.toLocaleTimeString().slice(0,5) };
    setMessages(prev => [...prev, aiMsg]);
    try {
      await chatSSE(
        { session_id: id, query: content },
        {
          onMessage: (delta, meta) => {
            aiMsg = { ...aiMsg, content: aiMsg.content + (delta || '') };
            setMessages(prev => {
              const copy = [...prev];
              copy[copy.length - 1] = { ...aiMsg };
              return copy;
            });
          },
          onError: (err) => {
            setLoading(false);
            setToast({ visible: true, message: err?.message || 'AI回复失败，请重试' });
          },
          onComplete: () => {
            setLoading(false);
          },
        }
      );
    } catch (e) {
      setLoading(false);
      setToast({ visible: true, message: e?.message || 'AI回复失败，请重试' });
    }
  };

  return (
    <>
      <SubLayout
        title="智能体咨询"
        showBack={true}
        onBack={() => navigate(-1)}
        rightActions={rightActions}
        headerStyle={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}
        children={
          <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {/* 消息流渲染，AI 消息含 sources 字段时渲染引用卡 */}
              <div>
                {messages.map((msg, idx) => (
                  <div key={msg.id || idx}>
                    <MessageList messages={[msg]} />
                    {/* AI 消息含 sources 字段时渲染引用卡 */}
                    {msg.role === 'ai' && Array.isArray(msg.sources) && msg.sources.length > 0 && (
                      <ReferenceCard sources={msg.sources} />
                    )}
                    {/* AI 消息含 quickActions 字段时渲染快捷操作条 */}
                    {msg.role === 'ai' && Array.isArray(msg.quickActions) && msg.quickActions.length > 0 && (
                      <QuickActions actions={msg.quickActions.map(action => ({
                        ...action,
                        onClick: () => {
                          if (typeof action.onClick === 'function') {
                            action.onClick();
                          } else if (action.value) {
                            // 默认填充到输入框或触发发送
                            // 可根据实际需求扩展
                          }
                        }
                      }))} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <InputBar onSend={handleSend} disabled={loading} />
          </div>
        }
      />
      <Toast
        visible={toast.visible}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </>
  );
};

export default ConsultationPage;
