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
    return <div className="session-list__error">{error || '加载失败'}</div>;
  }
  if (!sessions || sessions.length === 0) {
    return <div className="session-list__empty">暂无历史会话，快去创建吧！</div>;
  }
  return (
    <ul className="session-list">
      {sessions.map((s) => (
        <li
          className="session-list__item"
          key={s.sessionId || s.id}
          onClick={() => onSessionClick && onSessionClick(s)}
        >
          <div className="session-list__title">{s.title || '未命名会话'}</div>
          <div className="session-list__meta">
            <span>{s.lastMessage || ''}</span>
            <span className="session-list__date">{s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
