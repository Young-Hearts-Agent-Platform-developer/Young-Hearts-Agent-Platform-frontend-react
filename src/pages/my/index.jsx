import React from 'react';
import { useUser } from '../../store/useUser';

const MyPage = () => {
  const { user, isAuthenticated, logout, loading } = useUser();

  if (loading) return <div>加载中...</div>;
  if (!isAuthenticated) return <div>未登录</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>个人中心</h2>
      <div>
        <strong>用户名：</strong>{user.username}
      </div>
      <div>
        <strong>角色：</strong>{user.roles?.join(', ') || '无'}
      </div>
      <button onClick={logout} style={{ marginTop: 16 }}>退出登录</button>
    </div>
  );
};

export default MyPage;
