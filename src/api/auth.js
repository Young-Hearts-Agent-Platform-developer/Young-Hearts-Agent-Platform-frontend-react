// 鉴权相关 API 封装，所有请求自动携带 Cookie


// ===============================
// MOCK 用户，仅开发环境使用，勿提交生产！
// ===============================
// MOCK 用户对象定义
// 后续可切换为独立 mock 文件或通过环境变量配置
export const MOCK_USER = {
  nickname: '心青年开发者',
  roles: ['志愿者'], 
  avatar: '/src/assets/user.png',
  email: 'devuser@younghearts.com',
  id: 'mock-001',
  // 可根据页面需求补充更多字段
};

const API_BASE = '/api/auth';


export async function getCurrentUser() {
  // ===============================
  // MOCK 用户，仅开发环境使用，勿提交生产！
  // ===============================
  if (import.meta.env.MODE === 'development') {
    // Phase 2: 开发环境下直接返回 MOCK_USER
    return { user: MOCK_USER };
  }
  const res = await fetch(`${API_BASE}/me`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('未登录');
  return await res.json();
}

export async function login({ username, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('登录失败');
  return await res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('登出失败');
  return await res.json();
}
