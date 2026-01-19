import React from 'react';
import './index.css';

/**
 * 会话列表组件
 * @param {Object} props
 * @param {Array} props.sessions 会话数组
 * @param {boolean} props.loading 加载中
 * @param {any} props.error 错误信息
 * @param {Function} props.onSessionClick 点击会话回调
 */
export default function SessionList({ sessions, loading, error, onSessionClick }) {
  if (loading) {
    return <div className="session-list__loading">加载中...</div>;
  }
  if (error) {
    const msg = typeof error === 'string' ? error : '加载失败';
    return <div className="session-list__error">{msg}</div>;
  }
  if (!sessions || sessions.length === 0) {
    return <div className="session-list__empty">暂无历史会话，快去创建吧！</div>;
  }
  // 仅使用后端标准字段并限制最多展示 20 条
  const list = sessions.slice(0, 20);
  return (
    <ul className="session-list">
      {list.map((s) => (
        <li
          className="session-list__item"
          key={s.id}
          onClick={() => onSessionClick && onSessionClick(s.id)}
        >
          <div className="session-list__title">{s.title || '新对话'}</div>
          <div className="session-list__meta">
            <span>{s.lastMessage || ''}</span>
            <span className="session-list__date">{s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
