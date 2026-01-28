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
import { getSessionMessages, chatSSE, getSessions } from '../../api/consult';
import { useConsultSession } from '../../store/consultSession';


// Chat 页面主组件
// session_id 通过 useParams() 获取，id 即为 session_id
const ConsultationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id 即 session_id

  // 弹窗状态
  const [toast, setToast] = useState({ visible: false, message: '' });
  // 消息流状态
  const [messages, setMessages] = useState([]);

  // 副标题状态
  const [subtitle, setSubtitle] = useState('新对话');
  // 是否副标题加载失败
  const [subtitleError, setSubtitleError] = useState(false);

  const { setSessionTitle } = useConsultSession();

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

  // 拉取会话 topic 作为副标题
  useEffect(() => {
    let ignore = false;
    if (!id) {
      setSubtitle('新对话');
      setSubtitleError(false);
      return;
    }
    setSubtitle('新对话');
    setSubtitleError(false);
    getSessions()
      .then(res => {
        if (ignore) return;
        if (res && Array.isArray(res.sessions)) {
          const session = res.sessions.find(s => String(s.id) === String(id));
          if (session && session.title) {
            setSubtitle(session.title);
            setSubtitleError(false);
          } else {
            setSubtitle('新对话');
            setSubtitleError(false);
          }
        } else {
          setSubtitle('加载失败');
          setSubtitleError(true);
        }
      })
      .catch(() => {
        if (ignore) return;
        setSubtitle('加载失败');
        setSubtitleError(true);
      });
    return () => { ignore = true; };
  }, [id]);


  // AI 回复流式追加
  const [loading, setLoading] = useState(false);
  // requestAnimationFrame 节流流式渲染
  const rafRef = React.useRef();
  const aiMsgRef = React.useRef(null);
  const [pendingDelta, setPendingDelta] = useState("");

  const flushAIMsg = React.useCallback(() => {
    setMessages(prev => {
      const copy = [...prev];
      if (aiMsgRef.current && copy.length > 0) {
        copy[copy.length - 1] = { ...aiMsgRef.current };
      }
      return copy;
    });
    rafRef.current = null;
  }, []);

  useEffect(() => {
    if (pendingDelta) {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          flushAIMsg();
          setPendingDelta("");
        });
      }
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [pendingDelta, flushAIMsg]);

  // ...existing code...
  // 发送消息时调用 chatSSE，需确保参数中包含 session_id
  // session_id 由 useParams() 获取的 id 传递
  const handleSend = async (content) => {
    if (!content) return;
    setLoading(true);
    const now = new Date();
    const userMsg = { role: 'user', content, time: now.toLocaleTimeString().slice(0,5) };
    setMessages(prev => [...prev, userMsg]);
    let aiMsg = { role: 'ai', content: '', time: now.toLocaleTimeString().slice(0,5) };
    aiMsgRef.current = aiMsg;
    setMessages(prev => [...prev, aiMsg]);
    try {
      /**
       * @type {import('../../types/ChatRequest').ChatRequest}
       */
      const chatParams = {
        session_id: id, // session_id 必须传递，来源于 useParams()
        query: content,
        role: 'counselor',
        reasoning_effort: null
      };
      // 调试用，确保请求体字段齐全
      console.log('chatSSE params:', chatParams);
      await chatSSE(
        chatParams,
        {
          onMessage: (delta, meta) => {
            if (meta && meta.isTopic) {
              setSessionTitle(id, delta && delta.trim() ? delta : '新对话');
            }
            aiMsgRef.current = { ...aiMsgRef.current, content: (aiMsgRef.current?.content || "") + (delta || "") };
            setPendingDelta(delta || "");
          },
          onError: (err) => {
            setLoading(false);
            setToast({ visible: true, message: err?.message || 'AI回复失败，请重试' });
          },
          onComplete: () => {
            setLoading(false);
            flushAIMsg();
          },
        }
      );
    } catch (e) {
      setLoading(false);
      setToast({ visible: true, message: e?.message || 'AI回复失败，请重试' });
    }
  };
// session_id 获取与传递链路说明：
// 1. 通过 useParams() 获取 id，作为 session_id
// 2. 发送消息等操作时，chatSSE 参数中必须包含 session_id
// 3. 若 session_id 缺失，后续 Phase 会做兜底处理

  return (
    <>
      <SubLayout
        title="智能体咨询"
        subtitle={
          subtitleError ? (
            <span style={{ color: 'red' }}>{subtitle}</span>
          ) : subtitle
        }
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
