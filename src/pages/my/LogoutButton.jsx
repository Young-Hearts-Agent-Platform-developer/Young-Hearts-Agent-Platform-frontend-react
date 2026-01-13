
import React from 'react';
import './LogoutButton.css';
import { useUser } from '../../store/useUser';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  if (!user) return null;

  return (
    <div className="logout-btn-placeholder">
      <button className="logout-btn" onClick={handleLogout}>退出登录</button>
    </div>
  );
};

export default LogoutButton;
