// src/store/consultSession.js
// 会话状态管理，异常/权限处理补充
import { createContext, useContext, useState } from 'react';
import { getSessions, createSession } from '../api/consult';

const ConsultSessionContext = createContext();

export function ConsultSessionProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载会话列表
  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await getSessions();
      // 兼容后端可能返回的不同结构：直接数组 / 分页结构 {items: []} / 统一结构 {data: []}
      let list = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (res && Array.isArray(res.items)) {
        list = res.items; // 分页结构常见 items
      } else if (res && Array.isArray(res.data)) {
        list = res.data; // 通用数据结构 data
      }
      setSessions(list);
      setError(null);
    } catch (e) {
      console.error('loadSessions error:', e);
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
