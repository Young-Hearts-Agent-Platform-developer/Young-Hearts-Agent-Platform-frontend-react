import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddOutline } from 'antd-mobile-icons';
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
  const { createSession, goToSession } = useNewSession();

  useEffect(() => {
    if (userLoading) return;
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    loadSessions();
    // eslint-disable-next-line
  }, [isAuthenticated, userLoading]);

  // 新建会话后仅跳转 session 的 id，无需兼容旧结构
  const handleNewSession = async () => {
    try {
      const session = await createSession();
      if (session && session.id) {
        
        goToSession(session.id);
      }
    } catch {
      setLocalError('新建会话失败');
    }
  };

  // 会话详情仅通过 id 跳转
  const handleSessionClick = (id) => {
    navigate(`/consultation/chat/${id}`);
  };

  return (
    <SubLayout
      title="历史会话"
      subtitle={null}
      rightActions={<IconActionButton icon={<AddOutline />} onClick={handleNewSession} title="新对话" />}
      onBack={undefined}
      headerStyle={undefined}
      showBack={true}
      headerClassName={undefined}
      children={
        <SessionList
          sessions={sessions}
          loading={loading}
          error={error || localError}
          onSessionClick={handleSessionClick}
        />
      }
    >
      
    </SubLayout>
  );
}

export default HistoryPage;
