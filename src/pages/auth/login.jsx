import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../store/useUser';
import '../../styles/variables.css';

const Login = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const { login, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 键盘无障碍：Enter 提交
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const username = usernameRef.current.value.trim();
    const password = passwordRef.current.value;
    if (!username || !password) {
      setError('请输入用户名和密码');
      setLoading(false);
      return;
    }
    const result = await login({ username, password });
    if (result !== true) {
      setError(result || '登录失败');
      setLoading(false);
      return;
    }
    // 登录成功后的跳转逻辑
    setLoading(false);
    // 来源页优先，支持 history.state、location.state、query（如有）
    let from = null;
    // 1. location.state?.from
    if (location.state && location.state.from) {
      from = location.state.from;
    }
    // 2. history.state?.from (部分浏览器支持)
    else if (window.history && window.history.state && window.history.state.from) {
      from = window.history.state.from;
    }
    // 3. URL query: ?from=/xxx
    else {
      const params = new URLSearchParams(window.location.search);
      if (params.get('from')) {
        from = params.get('from');
      }
    }
    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate('/my', { replace: true });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">登录“心青年”平台</h2>
        <label htmlFor="username" className="login-label">用户名</label>
        <input
          id="username"
          name="username"
          type="text"
          className="login-input"
          ref={usernameRef}
          tabIndex={1}
          autoFocus
          autoComplete="username"
          onKeyDown={handleKeyDown}
          disabled={loading || userLoading}
        />
        <label htmlFor="password" className="login-label">密码</label>
        <input
          id="password"
          name="password"
          type="password"
          className="login-input"
          ref={passwordRef}
          tabIndex={2}
          autoComplete="current-password"
          onKeyDown={handleKeyDown}
          disabled={loading || userLoading}
        />
        {error && <div className="login-error" style={{ color: 'var(--danger-color, #e74c3c)', fontSize: '0.95rem', marginTop: '-0.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>{error}</div>}
        <button
          type="submit"
          className="login-button"
          tabIndex={3}
          disabled={loading || userLoading}
        >
          {loading || userLoading ? '登录中…' : '登录'}
        </button>
      </form>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background-color, #f7f8fa);
        }
        .login-form {
          background: var(--card-bg, #fff);
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          padding: 2.5rem 2rem 2rem 2rem;
          min-width: 320px;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .login-title {
          color: var(--primary-color, #2d7cf7);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .login-label {
          color: var(--text-color, #222);
          font-size: 1rem;
          margin-bottom: 0.2rem;
        }
        .login-input {
          padding: 0.7rem 1rem;
          border: 1px solid var(--border-color, #e0e0e0);
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .login-input:focus {
          border-color: var(--primary-color, #2d7cf7);
        }
        .login-button {
          background: var(--primary-color, #2d7cf7);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0.8rem 0;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.2s;
        }
        .login-button:active {
          background: var(--primary-active, #1756b3);
        }
        .login-error {
          min-height: 1.2em;
        }
      `}</style>
    </div>
  );
};

export default Login;
