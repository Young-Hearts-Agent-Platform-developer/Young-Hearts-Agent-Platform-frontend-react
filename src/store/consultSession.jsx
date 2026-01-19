// src/store/consultSession.js
// 会话状态管理，异常/权限处理补充
import { createContext, useContext, useState } from 'react';
import { getSessions, createSession } from '../api/consult';

const ConsultSessionContext = createContext();

export function ConsultSessionProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 只处理标准结构 res.sessions
  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await getSessions();
      const list = res && Array.isArray(res.sessions) ? res.sessions : [];
      setSessions(list);
      setError(null);
    } catch (e) {
      setError('加载失败，请稍后重试');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // 新建会话
  const newSession = async () => {
    try {
      const session = await createSession();
      setError(null);
      return session;
    } catch (e) {
      setError('新建会话失败');
      throw e;
    }
  };

  // 不依赖用户上下文，只暴露会话相关内容
  return (
    <ConsultSessionContext.Provider value={{ sessions, loading, error, loadSessions, newSession }}>
      {children}
    </ConsultSessionContext.Provider>
  );
}

export function useConsultSession() {
  const context = useContext(ConsultSessionContext);
  if (!context) {
    throw new Error('useConsultSession 必须在 ConsultSessionProvider 内使用');
  }
  return context;
}
