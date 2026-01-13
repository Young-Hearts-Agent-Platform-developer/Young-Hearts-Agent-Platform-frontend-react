import React from 'react';
import './LogoutButton.css';

const LogoutButton = () => {
  return (
    <div className="logout-btn-placeholder">
      {/* 登出按钮占位，无需实现功能 */}
      <button className="logout-btn" disabled>退出登录</button>
    </div>
  );
};

export default LogoutButton;
