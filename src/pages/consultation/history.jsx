import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SubLayout from '../../layouts/SubLayout';
import IconActionButton from '../../components/IconActionButton';
import SessionList from './SessionList';
import { useConsultSession } from '../../store/consultSession.jsx';
import { UserContext } from '../../store/UserContext';
import useNewSession from '../../hooks/useNewSession';

const HistoryPage = () => {
  const { isAuthenticated, loading: userLoading } = useContext(UserContext) || {};
  const { sessions, loading, error, loadSessions } = useConsultSession();
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();
  const { createSession } = useNewSession();

  useEffect(() => {
    if (userLoading) return;
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    loadSessions();
    // eslint-disable-next-line
  }, [isAuthenticated, userLoading]);

  // 新建会话后仅跳转 sessionId，无需兼容旧结构
  const handleNewSession = async () => {
    try {
      const session = await createSession();
      if (session && session.sessionId) {
        navigate(`/consultation/chat/${session.sessionId}`);
      }
    } catch {
      setLocalError('新建会话失败');
    }
  };

  // 会话详情仅通过 sessionId 跳转
  const handleSessionClick = (sessionId) => {
    navigate(`/consultation/chat/${sessionId}`);
  };

  return (
    <SubLayout
      title="历史会话"
      right={<IconActionButton icon="plus" onClick={handleNewSession} title="新对话" />}
    >
      <SessionList
        sessions={sessions}
        loading={loading}
        error={error || localError}
        onSessionClick={handleSessionClick}
      />
    </SubLayout>
  );
}

export default HistoryPage;
