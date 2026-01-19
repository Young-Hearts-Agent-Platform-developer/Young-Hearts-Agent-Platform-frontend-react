import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './index.css';

// 消息气泡组件
function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
      <div className="bubble-content">{message.content}</div>
      <div className="bubble-meta">{message.time}</div>
    </div>
  );
}

MessageBubble.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    content: PropTypes.string,
    time: PropTypes.string,
  }).isRequired,
};

// 消息流组件
export default function MessageList({ messages }) {
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="message-list" ref={listRef}>
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} />
      ))}
    </div>
  );
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string,
      content: PropTypes.string,
      time: PropTypes.string,
    })
  ).isRequired,
};
