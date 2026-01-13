import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, login as apiLogin, logout as apiLogout } from '../api/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 拉取当前用户信息
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCurrentUser();
      setUser(res.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 登录
  const login = async (credentials) => {
    await apiLogin(credentials);
    await fetchUser();
  };

  // 登出
  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  // 权限校验
  const checkPermission = (requiredRole) => {
    if (!user || !user.roles) return false;
    if (!requiredRole) return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => user.roles.includes(role));
    }
    return user.roles.includes(requiredRole);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        checkPermission,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
