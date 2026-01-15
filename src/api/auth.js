// 预留邮箱验证接口（Phase 3 邮箱字段编辑弹窗用）
// 用法示例：await sendEmailVerification(email)
// export async function sendEmailVerification(email) {
//   // TODO: 实现邮箱验证API调用
//   // return await fetch('/api/auth/verify-email', { method: 'POST', body: JSON.stringify({ email }) })
//   return Promise.resolve(); // 占位
// }
// 用户信息更新接口（Phase 3）
export async function updateUserProfile(data) {
  // 真实环境应为 /api/users/profile
  return fetch('/api/users/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then(res => {
    if (!res.ok) throw new Error('更新失败');
    return res.json();
  });
}
// 鉴权相关 API 封装，所有请求自动携带 Cookie


// ===============================
// MOCK 用户，仅开发环境使用，勿提交生产！
// ===============================
// MOCK 用户对象定义
// 后续可切换为独立 mock 文件或通过环境变量配置
export const MOCK_USER = {
  id: 0,
  username: 'dev-user',
  gender: 'male',
  email: 'devuser@younghearts.com',
  nickname: '心青年开发者',
  avatar: '/src/assets/user.png',
  roles: ['volunteer', 'expert', 'future_role'],
  status: 'active',
  created_at: '2026-01-01T00:00:00Z',
  volunteer_profile: {
    user_id: 0,
    full_name: '张志愿',
    phone: '13800000000',
    public_email: 'volunteer@younghearts.com',
    is_public_visible: true,
    service_hours: 120,
    skills: ['心理陪伴', '活动组织'],
    status: 'approved',
    work_status: 'online',
    bio: '热心志愿者',
  },
  expert_profile: {
    user_id: 0,
    full_name: '李专家',
    title: '心理咨询师',
    organization: '心青年研究院',
    qualifications: ['https://cert.example.com/abc.pdf'],
    specialties: ['青少年心理', '危机干预'],
    phone: '13900000000',
    public_email: 'expert@younghearts.com',
    is_public_visible: true,
    status: 'approved',
    bio: '专注心理健康研究',
  },
  future_role_profile: {
    user_id: 0,
    custom_field: '自定义扩展',
    status: 'pending',
  }
};

const API_BASE = '/api/auth';


export async function getCurrentUser() {
  // ===============================
  // MOCK 用户，仅开发环境使用，勿提交生产！
  // ===============================
  if (import.meta.env.MODE === 'development') {
    // 直接返回 MOCK_USER，结构与 User 类型一致
    return { user: { ...MOCK_USER } };
  }
  const res = await fetch(`${API_BASE}/me`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('未登录');
  return await res.json();
}

export async function login({ username, password }) {
  if (import.meta.env.MODE === 'development') {
    // mock 登录，直接返回 user 信息，结构与 User 类型一致
    return {
      user: { ...MOCK_USER },
      token: 'mocked_token',
    };
  }
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
  if (import.meta.env.MODE === 'development') {
    // mock 登出，返回成功
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('登出失败');
  return await res.json();
}
