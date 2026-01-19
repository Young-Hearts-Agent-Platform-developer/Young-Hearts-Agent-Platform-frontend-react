import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SubLayout from '../../layouts/SubLayout';
import IconActionButton from '../../components/IconActionButton';
import SessionList from './SessionList';
// import { getSessions, createSession } from '../../api/consult';
import { useConsultSession } from '../../store/consultSession.jsx';
import { UserContext } from '../../store/UserContext';

const HistoryPage = () => {
  const { user } = useContext(UserContext) || {};
  const { sessions, loading, error, loadSessions, newSession } = useConsultSession();
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    loadSessions();
    // eslint-disable-next-line
  }, [user]);

  const handleNewSession = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    try {
      const session = await newSession();
      if (session && session.sessionId) {
        navigate(`/consultation/chat/${session.sessionId}`);
      }
    } catch {
      setLocalError('新建会话失败');
    }
  };

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
