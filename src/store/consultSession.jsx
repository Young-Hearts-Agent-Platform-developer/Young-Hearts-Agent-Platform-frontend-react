// src/store/consultSession.js
// 会话状态管理，异常/权限处理补充
import { createContext, useContext, useState } from 'react';
import { getSessions, createSession } from '../api/consult';

const ConsultSessionContext = createContext();

export function ConsultSessionProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 只处理标准结构 res.sessions，全部以 id 字段为主
  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await getSessions();
      // 兼容 res 直接为数组 或 res.sessions 为数组
      let list = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (res && Array.isArray(res.sessions)) {
        list = res.sessions;
      }
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

  // 按 sessionId 更新 title，title 为空时兜底为“新对话”
  const setSessionTitle = (sessionId, title) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId
        ? { ...s, title: title && title.trim() ? title : '新对话' }
        : s
    ));
  };

  // 不依赖用户上下文，只暴露会话相关内容
  return (
    <ConsultSessionContext.Provider value={{ sessions, loading, error, loadSessions, newSession, setSessionTitle }}>
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

// 便于直接调用，无需 useContext
export function setSessionTitleExternal(setSessions, sessionId, title) {
  setSessions(prev => prev.map(s =>
    s.id === sessionId
      ? { ...s, title: title && title.trim() ? title : '新对话' }
      : s
  ));
}
